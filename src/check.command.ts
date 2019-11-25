import * as minimist from 'minimist';
import { check, checking } from './check';

interface Params {
  _: string[];
  output: string;
  translation: string;
}

(function main() {
  try {
    const params = getParams();

    checking.on('checking', ({ keys, sources }) => console.log(`Checking ${keys.length} keys in ${sources.length} files...`));
    checking.on('checked', ({ unused, outputPath }) => console.log(`Found ${unused.length} unused keys: "${outputPath}"`));
    // checking.on('used', ({ key, source }) => console.log(`${key} is used by ${source.path}`));
    checking.on('unused', ({ key }) => console.log(`${key} is unused`));
    check(params.translation, params._, params.output);
    checking.removeAllListeners();

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  if (!params.translation) {
    throw new Error('--translation required');
  }

  if (!params.output) {
    params.output = './unused.txt';
  }

  if (!params._ || params._.length === 0) {
    throw new Error('<sources> required');
  }

  return params;
}
