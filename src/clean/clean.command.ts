import * as minimist from 'minimist';
import { Cleaner } from './cleaner';

interface Params {
  keys: string;
  translations: string;
}

(function main() {
  try {
    const params = getParams();

    const cleaner = new Cleaner();
    cleaner.on('cleaning', ({ keys, translations }) => console.log(`Removing ${keys.length} keys from ${translations.length} files...`));
    cleaner.on('removed', ({ key, file }) => console.log(`Removed "${key}" from "${file.path}".`));
    cleaner.on('passed', ({ key, file }) => console.log(`Passed "${key}" from "${file.path}".`));
    cleaner.clean(params.keys, params.translations);
    cleaner.removeAllListeners();

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  if (!params.keys) {
    params.keys = './unused.txt';
  }

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}
