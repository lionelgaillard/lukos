import { readFile } from 'fs-extra';
import * as tap from 'tap';
import { deserializeComparedTranslations, loadTranslation } from '../common/translations';
import { Completer } from './completer';

const dir = tap.testdir({
  'en.json': JSON.stringify({
    a: 'en/a',
    b: 'en/b',
    c: 'en/c',
    groupA: {
      a: 'en/groupA/a',
    },
    groupB: {
      a: 'en/groupB/a',
      b: 'en/groupB/b',
    },
  }),
  'fr.json': JSON.stringify({
    b: 'fr/b',
    c: 'fr/c',
    d: 'fr/d',
    groupB: {
      b: 'fr/groupB/b',
    },
  }),
  'compared.txt': [
    `@@@ ${tap.testdirName}/en.json`,
    `@@@ ${tap.testdirName}/fr.json`,
    '+++ d',
    '--- a',
    '--- b',
    '--- groupA.a',
    '--- groupB.a',
  ].join('\n'),
});

tap.test('completer', async t => {
  const completer = new Completer();

  t.emits(completer, 'completing', 'should emit completing event');
  t.emits(completer, 'completed', 'should emit completed event');
  t.emits(completer, 'added', 'should emit added event');
  t.emits(completer, 'passed', 'should emit passed event');

  const diff = await deserializeComparedTranslations(await readFile(`${dir}/compared.txt`, 'utf8'));
  const reference = await loadTranslation(`${dir}/en.json`);
  const completed = await completer.complete(diff, reference);

  const fr = completed.find(file => file.path.endsWith('fr.json')).data;

  t.equal(fr.a, 'en/a', 'fr should have "a" key');
  t.equal(fr.b, 'fr/b', 'fr should keep "b" key');

  t.ok(fr.groupA, 'fr should have "groupA" group');
  t.equal(fr.groupA.a, 'en/groupA/a', 'fr should have "groupA.a" key');

  t.ok(fr.groupB, 'fr should have "groupB" group');
  t.equal(fr.groupB.a, 'en/groupB/a', 'fr should have "groupB.a" key');
  t.equal(fr.groupB.b, 'fr/groupB/b', 'fr should heep "groupB.b" key');

  t.end();
});
