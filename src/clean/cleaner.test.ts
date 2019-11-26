import { readJsonSync } from 'fs-extra';
import * as tap from 'tap';
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
  'unused.txt': ['firstLevelUnused', 'firstLevelGroup.secondLevelUnused', ' ', 'notExists', 'notExists.neither', ''].join('\n'),
});

tap.test('cleaner', t => {
  const cleaner = new Cleaner();

  t.emits(cleaner, 'cleaning', 'should emit cleaning event');
  t.emits(cleaner, 'cleaned', 'should emit cleaned event');
  t.emits(cleaner, 'removed', 'should emit removed event');
  t.emits(cleaner, 'passed', 'should emit passed event');

  t.doesNotThrow(() => cleaner.clean(`${dir}/unused.txt`, `${dir}/??.json`));

  const data = readJsonSync(`${dir}/fr.json`);

  t.notOk(data.firstLevelUnused, 'should remove first level unused key');
  t.notOk(data.firstLevelGroup.secondLevelUnused, 'should remove second level unused key');

  t.ok(data.firstLevelUsed, 'should let first level used key');
  t.ok(data.firstLevelGroup, 'should let first level group');
  t.ok(data.firstLevelGroup.secondLevelUsed, 'should let second level used key');

  t.end();
});
