import test from 'ava';
import { fixtures } from '../tests';
import { TranslationFile } from '../translations';
import { Renamer } from './renamer';

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

test('renamer', async t => {
  t.plan(12);

  const renamer = new Renamer();

  renamer.once('rename.pre', () => t.pass('should emit rename.pre event'));
  renamer.once('rename.post', () => t.pass('should emit rename.post event'));
  renamer.once('renamed', () => t.pass('should emit renamed event'));
  renamer.once('passed', () => t.pass('should emit passed event'));

  const translations = TranslationFile.fromGlob(`${dir}/??.json`);
  renamer.rename('b', 'c.z', translations);
  translations.map(t => t.save());

  const de = TranslationFile.fromPath(`${dir}/de.json`);
  const en = TranslationFile.fromPath(`${dir}/en.json`);
  const fr = TranslationFile.fromPath(`${dir}/fr.json`);

  t.true(!de.has('b'), 'Old key has been removed');
  t.true(de.has('c.z'), 'New key has been added');
  t.true(de.get('c.z') === 'b', 'Value has been moved');

  t.true(!en.has('b'), 'Old key has been removed');
  t.true(en.has('c.z'), 'New key has been added');
  t.true(en.get('c.z') === 'b', 'Value has been replaced');

  t.false(fr.has('b'), "Old unexisting key still doesn't exist");
  t.false(fr.has('c.z'), "New key still doesn't exist");
});
