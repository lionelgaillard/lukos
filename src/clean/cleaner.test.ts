import test from 'ava';
import { readFile } from 'fs-extra';
import { deserializeKeys } from '../keys';
import { fixtures } from '../tests';
import { loadTranslations } from '../translations';
import { Cleaner } from './cleaner';

const translation = JSON.stringify({
  firstLevelUsed: 'Lorem',
  firstLevelUnused: 'ipsum',
  firstLevelGroup: {
    secondLevelUsed: 'dolor',
    secondLevelUnused: 'sit amet',
  },
});

const dir = fixtures({
  'en.json': translation,
  'fr.json': translation,
  'unused.txt': [
    '# firstLevelUsed',
    'firstLevelUnused',
    'firstLevelGroup.secondLevelUnused',
    ' ',
    'notExists',
    'notExists.neither',
    '',
  ].join('\n'),
});

test('cleaner', async t => {
  const cleaner = new Cleaner();

  t.plan(9);

  cleaner.once('cleaning', () => t.pass('should emit cleaning event'));
  cleaner.once('cleaned', () => t.pass('should emit cleaned event'));
  cleaner.once('removed', () => t.pass('should emit removed event'));
  cleaner.once('passed', () => t.pass('should emit passed event'));

  const unused = deserializeKeys(await readFile(`${dir}/unused.txt`, 'utf8'));
  const translations = await loadTranslations(`${dir}/??.json`);
  const cleaned = await cleaner.clean(unused, translations);

  const fr = cleaned.find(file => file.path.endsWith('fr.json')).data;

  t.falsy(fr.firstLevelUnused, 'should remove first level unused key');
  t.truthy(fr.firstLevelGroup, 'should let first level group');
  t.falsy(fr.firstLevelGroup.secondLevelUnused, 'should remove second level unused key');
  t.truthy(fr.firstLevelGroup.secondLevelUsed, 'should let second level used key');

  t.truthy(fr.firstLevelUsed, 'should let first level used key');
});
