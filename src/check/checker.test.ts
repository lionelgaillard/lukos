import { existsSync, readFileSync } from 'fs-extra';
import * as tap from 'tap';
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

tap.test('checker', t => {
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

  t.doesNotThrow(() => checker.check(`${dir}/??.json`, `${dir}/**.@(ts|html)`, `${dir}/unused.txt`), 'should run without exception');

  t.ok(existsSync(`${dir}/unused.txt`), 'should save output in given path');

  const content = readFileSync(`${dir}/unused.txt`, 'utf-8');
  t.ok(content, 'output file should not be empty');

  const unused = content.split('\n');
  t.equal(unused.length, 3, `should found 3 unused keys`);
  t.ok(unused.includes('firstLevelUnusedKey'), 'should found "firstLevelUnusedKey"');
  t.ok(unused.includes('firstLevelUsedGroup.secondLevelUnusedKey'), 'should found "firstLevelUsedGroup.secondLevelUnusedKey"');
  t.ok(unused.includes('firstLevelAnotherUnusedKey'), 'should found "firstLevelAnotherUnusedKey"');

  t.end();
});
