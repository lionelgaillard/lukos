import * as minimist from 'minimist';
import { clean, cleaning } from './clean';

interface Params {
  keys: string;
  _: string[];
}

(function main() {
  try {
    const params = getParams();

    cleaning.on('cleaning', ({ keys, translations }) => console.log(`Removing ${keys.length} keys from ${translations.length} files...`));
    cleaning.on('removed', ({ key, file }) => console.log(`Removed "${key}" from "${file.path}".`));
    cleaning.on('passed', ({ key, file }) => console.log(`Passed "${key}" from "${file.path}".`));
    clean(params.keys, params._);
    cleaning.removeAllListeners();

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

  if (!params._ || params._.length === 0) {
    throw new Error('<translations> required');
  }

  return params;
}
