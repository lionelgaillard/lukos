import test from 'ava';
import { readFile } from 'fs-extra';
import { fixtures } from '../tests';
import { NoopTranslator } from '../translate/noop.translator';
import { deserializeComparedTranslations } from '../translations';
import { Completer } from './completer';

const dir = fixtures({
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
    `### ${fixtures.dir}/en.json`,
    `@@@ ${fixtures.dir}/en.json`,
    `@@@ ${fixtures.dir}/fr.json`,
    '+++ d',
    '--- a',
    '--- b',
    '--- groupA.a',
    '--- groupB.a',
  ].join('\n'),
});

test('completer', async t => {
  const completer = new Completer(new NoopTranslator());

  t.plan(11);

  completer.once('completing', () => t.pass('should emit completing event'));
  completer.once('completed', () => t.pass('should emit completed event'));
  completer.once('added', () => t.pass('should emit added event'));
  completer.once('passed', () => t.pass('should emit passed event'));

  const diff = await deserializeComparedTranslations(await readFile(`${dir}/compared.txt`, 'utf8'));
  const completed = await completer.complete(diff);

  const fr = completed.find(file => file.path.endsWith('fr.json')).data;

  t.is(fr.a, 'en/a', 'fr should have "a" key');
  t.is(fr.b, 'fr/b', 'fr should keep "b" key');

  t.truthy(fr.groupA, 'fr should have "groupA" group');
  t.is(fr.groupA.a, 'en/groupA/a', 'fr should have "groupA.a" key');

  t.truthy(fr.groupB, 'fr should have "groupB" group');
  t.is(fr.groupB.a, 'en/groupB/a', 'fr should have "groupB.a" key');
  t.is(fr.groupB.b, 'fr/groupB/b', 'fr should heep "groupB.b" key');
});
