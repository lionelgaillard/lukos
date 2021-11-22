import test from 'ava';
import { exec as _exec } from 'child_process';
import { promisify } from 'util';
import { fixtures } from '../tests';

const exec = promisify(_exec);

const dir = fixtures({
  'en.json': JSON.stringify({
    about: 'About',
    hello: 'Hello',
    parent: {
      child: 'Nested item',
    },
    sentence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  }),
  'fr.json': JSON.stringify({
    // about: 'Is missing purposely',
    hello: 'Bonjour',
    parent: {
      child: 'Élément imbriqué',
    },
    sentence: 'Aenean risus odio, fermentum eu purus a, laoreet interdum nunc.',
  }),
});

test('export command', async t => {
  t.plan(2);

  const output = await exec(`node ./bin/lukos export "${dir}/??.json"`);
  const csv = output.stdout;
  const lines = csv.split('\n').filter(Boolean);

  t.deepEqual(lines.length, 5, 'CSV file has 5 lines');
  t.true(
    lines.every(line => line.split(',').length >= 2),
    'CSV file has 3 columns'
  );
});
