import { existsSync, readFileSync } from 'fs-extra';
import * as tap from 'tap';
import { check, checking } from './check';

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
  'test.ts': "export function test(): string { return 'firstLevelUsed' }",
  'test.html': "<div>{{ 'firstLevelGroup.secondLevelUsed' | translate }}</div>",
});

tap.test('check function', t => {
  t.emits(checking, 'checking', 'should emit checking event');
  t.emits(checking, 'checked', 'should emit checked event');
  t.emits(checking, 'used', 'should emit used event');
  t.emits(checking, 'unused', 'should emit unused event');

  t.doesNotThrow(
    () => check(`${dir}/en.json`, [`${dir}/**/*.ts`, `${dir}/**/*.html`], `${dir}/unused.txt`),
    'should run without exception'
  );

  t.ok(existsSync(`${dir}/unused.txt`), 'should save output in given path');

  const content = readFileSync(`${dir}/unused.txt`, 'utf-8');
  t.ok(content, 'ouput path should not be empty');

  const unused = content.split('\n');
  t.equal(unused.length, 2, 'should found 2 unused keys');
  t.ok(unused.includes('firstLevelUnused'), 'should found that "firstLevelUnused" is unused');
  t.ok(unused.includes('firstLevelGroup.secondLevelUnused'), 'should found that "firstLevelGroup.secondLevelUnused" is unused');

  t.end();
});
