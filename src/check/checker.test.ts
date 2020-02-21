import * as tap from 'tap';
import { loadFiles } from '../common/files';
import { loadTranslations } from '../common/translations';
import { Checker } from './checker';

const dir = tap.testdir({
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

tap.test('checker', async t => {
  const checker = new Checker();

  t.emits(checker, 'checking', 'should emit checking event');
  checker.once('checking', ({ keys, sources }) => {
    t.ok(keys, 'should have keys');
    t.equal(keys.length, 5, 'should found 5 keys');
    t.ok(sources, 'should have sources');
    t.equal(sources.length, 2, 'should found 2 sources');
  });

  t.emits(checker, 'checked', 'should emit checked event');

  t.emits(checker, 'used', 'should emit used event');
  t.emits(checker, 'unused', 'should emit unused event');

  const translations = loadTranslations(`${dir}/??.json`);
  const sources = loadFiles(`${dir}/**.@(ts|html)`);
  const unused = await checker.check(translations, sources);

  t.equal(unused.length, 3, `should found 3 unused keys`);
  t.ok(unused.includes('firstLevelUnusedKey'), 'should found "firstLevelUnusedKey"');
  t.ok(unused.includes('firstLevelUsedGroup.secondLevelUnusedKey'), 'should found "firstLevelUsedGroup.secondLevelUnusedKey"');
  t.ok(unused.includes('firstLevelAnotherUnusedKey'), 'should found "firstLevelAnotherUnusedKey"');

  t.end();
});
