import test from 'ava';
import { exec as _exec } from 'child_process';
import { existsSync, readJsonSync } from 'fs-extra';
import { promisify } from 'util';
import { executable, fixtures } from '../tests';

const exec = promisify(_exec);

const dir = fixtures({
  'examples.csv': [
    'key,en,fr',
    'about,About,',
    'hello,Hello,Bonjour',
    'parent.child,Nested item,Élément imbriqué',
    'sentence,"Lorem ipsum dolor sit amet, consectetur adipiscing elit.","Aenean risus odio, fermentum eu purus a, laoreet interdum nunc."',
    '',
  ].join('\n'),
});

test('import command', async t => {
  t.plan(5);

  const output = await exec(`cat "${dir}/examples.csv" | node ${executable} import`, { cwd: dir });

  t.true(existsSync(`${dir}/en.json`), 'Generated "en.json"');
  t.true(existsSync(`${dir}/fr.json`), 'Generated "fr.json"');

  const en = readJsonSync(`${dir}/en.json`);
  const fr = readJsonSync(`${dir}/fr.json`);

  t.deepEqual(en?.parent?.child, 'Nested item', 'Has nested item');
  t.deepEqual(fr?.about, '', 'fr.about is empty');
  t.deepEqual(fr?.sentence, 'Aenean risus odio, fermentum eu purus a, laoreet interdum nunc.', 'Has sentence with spaces and comma');
});
