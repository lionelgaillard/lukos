import { readJsonSync } from 'fs-extra';
import * as tap from 'tap';
import { clean, cleaning } from './clean';

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
  'unused.txt': ['firstLevelUnused', 'firstLevelGroup.secondLevelUnused', ' ', 'notExists', ''].join('\n'),
});

tap.test('clean function', t => {
  t.emits(cleaning, 'cleaning', 'should emit cleaning event');
  t.emits(cleaning, 'cleaned', 'should emit cleaned event');
  t.emits(cleaning, 'removed', 'should emit removed event');
  t.emits(cleaning, 'passed', 'should emit passed event');

  t.doesNotThrow(() => clean(`${dir}/unused.txt`, [`${dir}/*.json`]));

  const data = readJsonSync(`${dir}/fr.json`);

  t.notOk(data.firstLevelUnused, 'should remove first level unused key');
  t.notOk(data.firstLevelGroup.secondLevelUnused, 'should remove second level unused key');

  t.ok(data.firstLevelUsed, 'should let first level used key');
  t.ok(data.firstLevelGroup, 'should let first level group');
  t.ok(data.firstLevelGroup.secondLevelUsed, 'should let second level used key');

  t.end();
});
