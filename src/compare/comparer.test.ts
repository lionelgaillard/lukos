import * as tap from 'tap';
import { Comparer } from './comparer';

const dir = tap.testdir({
  'en.json': JSON.stringify({
    firstLevelUsedKey: 'Used',
    firstLevelUnusedKey: 'Unused',
    firstLevelUsedGroup: {
      secondLevelUsedKey: 'Used as well',
      secondLevelUnusedKey: 'Also unused',
    },
    firstLevelSomeKey: 'Herp derp',
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
});

tap.test('comparer', t => {
  const comparer = new Comparer();

  t.emits(comparer, 'comparing', 'should emit comparing event');
  t.emits(comparer, 'compared', 'should emit compared event');
  t.emits(comparer, 'diff', 'should emit diff event');
  let compared;
  t.doesNotThrow(() => (compared = comparer.compare(`${dir}/en.json`, `${dir}/??.json`, `${dir}/compared.txt`)));

  t.ok(compared, 'should return compared files');
  t.equal(compared.length, 2, 'should have 2 files');

  const en = compared.find(f => f.path.endsWith('en.json'));
  t.ok(en, 'should have compared en.json');

  t.ok(en.additions, 'reference should have additions array');
  t.equal(en.additions.length, 0, 'reference file should have no additions');

  t.ok(en.substractions, 'reference should have substractions array');
  t.equal(en.substractions.length, 0, 'reference file should have no substractions');

  const fr = compared.find(f => f.path.endsWith('fr.json'));
  t.ok(fr, 'should have compared fr.json');

  t.ok(fr.additions, 'should have additions array');
  t.equal(fr.additions.length, 1, 'should have 1 addition');
  t.ok(fr.additions.includes('firstLevelAnotherUnusedKey'), 'should found "firstLevelAnotherUnusedKey" as additional key');

  t.ok(fr.substractions, 'should have substractions array');
  t.equal(fr.substractions.length, 1, 'should have 1 substraction');
  t.ok(fr.substractions.includes('firstLevelSomeKey'), 'should found "firstLevelSomeKey" as missing key');

  t.end();
});
