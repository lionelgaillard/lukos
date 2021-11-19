import test from 'ava';
import { exec as _exec } from 'child_process';
import { readJsonSync } from 'fs-extra';
import { promisify } from 'util';
import { fixtures } from '../tests';

const exec = promisify(_exec);

const dir = fixtures({
  'en.json': JSON.stringify({
    a: 'a',
    b: {
      ba: 'b.a',
    },
  }),
  'fr.json': JSON.stringify({
    a: 'a',
  }),
});

test('remove command', async t => {
  t.plan(4);

  await exec(`node ./bin/lukos rm "b" "${dir}/??.json"`);

  const en = readJsonSync(`${dir}/en.json`);
  const fr = readJsonSync(`${dir}/fr.json`);

  t.falsy(en.b, 'b has been removed');
  t.falsy(fr.b, 'b is still not there');

  t.truthy(en.a, 'a is still there');
  t.truthy(fr.a, 'a is still there');
});
