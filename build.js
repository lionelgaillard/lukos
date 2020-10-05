const { build } = require('esbuild');
const { readdirSync } = require('fs');
const { builtinModules } = require('module');
const otherModules = readdirSync('./node_modules');

build({
  entryPoints: ['./src/cli.ts'],
  outfile: './bin/lukos',
  bundle: true,
  external: [...builtinModules, ...otherModules],
}).catch(error => {
  console.error(error.message);
  process.exit(1);
});
