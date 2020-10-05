import { readFile } from 'fs-extra';
import tap from 'tap';
import { deserializeKeys } from '../keys';
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

const dir = tap.testdir({
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

tap.test('cleaner', async t => {
  const cleaner = new Cleaner();

  t.emits(cleaner, 'cleaning', 'should emit cleaning event');
  t.emits(cleaner, 'cleaned', 'should emit cleaned event');
  t.emits(cleaner, 'removed', 'should emit removed event');
  t.emits(cleaner, 'passed', 'should emit passed event');

  const unused = deserializeKeys(await readFile(`${dir}/unused.txt`, 'utf8'));
  const translations = await loadTranslations(`${dir}/??.json`);
  const cleaned = await cleaner.clean(unused, translations);

  const fr = cleaned.find(file => file.path.endsWith('fr.json')).data;

  t.notOk(fr.firstLevelUnused, 'should remove first level unused key');
  t.notOk(fr.firstLevelGroup.secondLevelUnused, 'should remove second level unused key');

  t.ok(fr.firstLevelUsed, 'should let first level used key');
  t.ok(fr.firstLevelGroup, 'should let first level group');
  t.ok(fr.firstLevelGroup.secondLevelUsed, 'should let second level used key');

  t.end();
});
