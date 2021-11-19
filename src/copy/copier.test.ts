import test from 'ava';
import { fixtures } from '../tests';
import { loadTranslation, loadTranslations, saveTranslations } from '../translations';
import { Copier } from './copier';

const dir = fixtures({
  'de.json': JSON.stringify({
    a: 'a',
    b: 'b',
    c: {
      x: 'x',
      y: 'y',
    },
  }),
  'en.json': JSON.stringify({
    a: 'a',
    b: 'b',
    c: {
      x: 'x',
      y: 'y',
      z: 'z',
    },
  }),
  'fr.json': JSON.stringify({
    a: 'a',
    c: {
      x: 'x',
      y: 'y',
    },
  }),
});

test('copier', async t => {
  const copier = new Copier();

  copier.once('copy.pre', () => t.pass('should emit copy.pre event'));
  copier.once('copy.post', () => t.pass('should emit copy.post event'));
  copier.once('copied', () => t.pass('should emit copied event'));
  copier.once('passed', () => t.pass('should emit passed event'));

  const translations = await loadTranslations(`${dir}/??.json`);
  copier.copy('b', 'c.z', translations);
  await saveTranslations(translations);

  const de = await loadTranslation(`${dir}/de.json`);
  const en = await loadTranslation(`${dir}/en.json`);
  const fr = await loadTranslation(`${dir}/fr.json`);

  t.true(de.has('b'), 'Old key has not been removed');
  t.true(de.has('c.z'), 'New key has been added');
  t.true(de.get('c.z') === 'b', 'Value has been moved');

  t.true(en.has('b'), 'Old key has not been removed');
  t.true(en.has('c.z'), 'New key has been added');
  t.true(en.get('c.z') === 'b', 'Value has been replaced');

  t.false(fr.has('b'), "Old unexisting key still doesn't exist");
  t.false(fr.has('c.z'), "New key still doesn't exist");
});
