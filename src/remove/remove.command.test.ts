import test from 'ava';
import { exec as _exec } from 'child_process';
import { readJsonSync } from 'fs-extra';
import { promisify } from 'util';
import { fixtures } from '../tests';

const exec = promisify(_exec);

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

test('remove command', async t => {
  t.plan(5);

  await exec(`cat ${dir}/unused.txt | node "${process.cwd()}/bin/lukos" remove "${dir}/??.json"`);

  const fr = readJsonSync(`${dir}/fr.json`);

  t.falsy(fr.firstLevelUnused, 'should remove first level unused key');
  t.truthy(fr.firstLevelGroup, 'should let first level group');
  t.falsy(fr.firstLevelGroup.secondLevelUnused, 'should remove second level unused key');
  t.truthy(fr.firstLevelGroup.secondLevelUsed, 'should let second level used key');
  t.truthy(fr.firstLevelUsed, 'should let first level used key');
});
