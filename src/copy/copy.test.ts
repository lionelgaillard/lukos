import test from 'ava';
import { fixtures } from '../tests';
import { loadTranslation, loadTranslations, saveTranslations } from '../translations';
import { copy } from './copy';

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

test('rename command', async t => {
  const translations = await loadTranslations(`${dir}/??.json`);
  await copy('b', 'c.z', translations);
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
