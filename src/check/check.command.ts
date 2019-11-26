import * as minimist from 'minimist';
import { Checker } from './checker';

interface Params {
  output: string;
  sources: string;
  translations: string;
}

(function main() {
  try {
    const params = getParams();

    const checker = new Checker();
    checker.on('checking', ({ keys, sources }) => console.log(`Checking ${keys.length} keys in ${sources.length} files...`));
    checker.on('checked', ({ unused, outputPath }) => console.log(`Found ${unused.length} unused keys: "${outputPath}"`));
    // checker.on('used', ({ key, source }) => console.log(`${key} is used by ${source.path}`));
    // checker.on('unused', ({ key }) => console.log(`${key} is unused`));
    checker.check(params.translations, params.sources, params.output);
    checker.removeAllListeners();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  if (!params.output) {
    params.output = './unused.txt';
  }

  if (!params.sources) {
    throw new Error('--sources required');
  }

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}
