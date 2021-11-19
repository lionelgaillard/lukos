import test from 'ava';
import { readFile } from 'fs-extra';
import { deserializeKeys } from '../keys';
import { fixtures } from '../tests';
import { loadTranslations } from '../translations';
import { Remover } from './remover';

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

test('remover', async t => {
  const remover = new Remover();

  t.plan(9);

  remover.once('remove.pre', () => t.pass('should emit remove.pre event'));
  remover.once('remove.post', () => t.pass('should emit remove.post event'));
  remover.once('removed', () => t.pass('should emit removed event'));
  remover.once('passed', () => t.pass('should emit passed event'));

  const unused = deserializeKeys(await readFile(`${dir}/unused.txt`, 'utf8'));
  const translations = await loadTranslations(`${dir}/??.json`);
  remover.remove(unused, translations);

  const fr = translations.find(file => file.path.endsWith('fr.json')).data;

  t.falsy(fr.firstLevelUnused, 'should remove first level unused key');
  t.truthy(fr.firstLevelGroup, 'should let first level group');
  t.falsy(fr.firstLevelGroup.secondLevelUnused, 'should remove second level unused key');
  t.truthy(fr.firstLevelGroup.secondLevelUsed, 'should let second level used key');

  t.truthy(fr.firstLevelUsed, 'should let first level used key');
});
