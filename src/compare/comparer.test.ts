import test from 'ava';
import { fixtures } from '../tests';
import { loadTranslation, loadTranslations } from '../translations';
import { Comparer } from './comparer';

const dir = fixtures({
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
  'de.json': JSON.stringify({
    firstLevelUsedKey: 'Gebraucht',
    firstLevelUnusedKey: 'Ungebraucht',
    firstLevelUsedGroup: {
      secondLevelUsedKey: 'Auch benutzt',
      secondLevelUnusedKey: 'Wird auch nicht verwendet',
    },
    firstLevelAnotherUnusedKey: 'Ein weiterer unbenutzter Schlüssel',
  }),
});

test('comparer', async t => {
  const comparer = new Comparer();

  t.plan(17);

  comparer.once('comparing', () => t.pass('should emit comparing event'));
  comparer.once('compared', () => t.pass('should emit compared event'));
  comparer.once('diff', () => t.pass('should emit diff event'));

  const reference = await loadTranslation(`${dir}/en.json`);
  const translations = await loadTranslations(`${dir}/??.json`);
  const compared = await comparer.compare(reference, translations);

  t.truthy(compared, 'should return compared files');
  t.is(compared.length, 3, 'should have 3 files');

  const en = compared.find(f => f.path.endsWith('en.json'));
  t.truthy(en, 'should have compared en.json');

  t.truthy(en.additions, 'reference should have additions array');
  t.is(en.additions.length, 0, 'reference file should have no additions');

  t.truthy(en.substractions, 'reference should have substractions array');
  t.is(en.substractions.length, 0, 'reference file should have no substractions');

  const fr = compared.find(f => f.path.endsWith('fr.json'));
  t.truthy(fr, 'should have compared fr.json');

  t.truthy(fr.additions, 'should have additions array');
  t.is(fr.additions.length, 1, 'should have 1 addition');
  t.truthy(fr.additions.includes('firstLevelAnotherUnusedKey'), 'should found "firstLevelAnotherUnusedKey" as additional key');

  t.truthy(fr.substractions, 'should have substractions array');
  t.is(fr.substractions.length, 1, 'should have 1 substraction');
  t.truthy(fr.substractions.includes('firstLevelSomeKey'), 'should found "firstLevelSomeKey" as missing key');
});
