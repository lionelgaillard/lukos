import * as minimist from 'minimist';
import { deserializeKeys } from '../common/keys';
import { input, log } from '../common/standard';
import { loadTranslations, saveTranslation } from '../common/translations';
import { Cleaner } from './cleaner';

interface Params {
  keys: string;
  translations: string;
}

(async function main() {
  try {
    const params = getParams();
    const cleaner = new Cleaner();
    cleaner.on('cleaning', ({ keys, translations }) => log(`Removing ${keys.length} keys from ${translations.length} files...`));
    cleaner.on('removed', ({ key, file }) => log(`Removed "${key}" from "${file.path}".`));
    cleaner.on('passed', ({ key, file }) => log(`Passed "${key}" from "${file.path}".`));
    const keys = deserializeKeys(await input());
    const translations = loadTranslations(params.translations);
    const cleaned = await cleaner.clean(keys, translations);
    cleaned.forEach(file => saveTranslation(file));
    cleaner.removeAllListeners();
    process.exit(0);
  } catch (error) {
    await log(error.message);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}
