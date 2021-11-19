import test from 'ava';
import { File } from '../files';
import { fixtures } from '../tests';
import { TranslationFile } from '../translations';
import { Checker } from './checker';

const dir = fixtures({
  'en.json': JSON.stringify({
    firstLevelUsedKey: 'Used',
    firstLevelUnusedKey: 'Unused',
    firstLevelUsedGroup: {
      secondLevelUsedKey: 'Used as well',
      secondLevelUnusedKey: 'Also unused',
    },
  }),
  'fr.json': JSON.stringify({
    firstLevelUsedKey: 'Utilisé',
    firstLevelUnusedKey: 'Inutilisé',
    firstLevelUsedGroup: {
      secondLevelUsedKey: 'Utilisé aussi',
      secondLevelUnusedKey: 'Pas non plus utilisé',
    },
    firstLevelAnotherUnusedKey: 'Une autre clé inutilisée',
  }),
  'test.ts': "export function test(): string { return 'firstLevelUsedKey' }",
  'test.html': "<div>{{ 'firstLevelUsedGroup.secondLevelUsedKey' | translate }}</div>",
});

test('checker', t => {
  const checker = new Checker();

  t.plan(12);

  checker.once('checking', ({ keys, sources }) => {
    t.pass('should emit checking event');
    t.truthy(keys, 'should have keys');
    t.is(keys.length, 5, 'should found 5 keys');
    t.truthy(sources, 'should have sources');
    t.is(sources.length, 2, 'should found 2 sources');
  });

  checker.once('checked', () => t.pass('should emit checked event'));
  checker.once('used', () => t.pass('should emit used event'));
  checker.once('unused', () => t.pass('should emit unused event'));

  const translations = TranslationFile.fromGlob(`${dir}/??.json`);
  const sources = File.fromGlob(`${dir}/**.@(ts|html)`);
  const unused = checker.check(translations, sources);

  t.is(unused.length, 3, `should found 3 unused keys`);
  t.true(unused.includes('firstLevelUnusedKey'), 'should found "firstLevelUnusedKey"');
  t.true(unused.includes('firstLevelUsedGroup.secondLevelUnusedKey'), 'should found "firstLevelUsedGroup.secondLevelUnusedKey"');
  t.true(unused.includes('firstLevelAnotherUnusedKey'), 'should found "firstLevelAnotherUnusedKey"');
});
