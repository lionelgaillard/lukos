import { readFileSync } from 'fs-extra';
import * as minimist from 'minimist';
import { deserializeKeys } from '../common/keys';
import { loadTranslations, saveTranslation } from '../common/translations';
import { Cleaner } from './cleaner';

interface Params {
  input: string;
  keys: string;
  translations: string;
}

(function main() {
  try {
    const params = getParams();
    const cleaner = new Cleaner();
    cleaner.on('cleaning', ({ keys, translations }) => console.log(`# Removing ${keys.length} keys from ${translations.length} files...`));
    cleaner.on('removed', ({ key, file }) => console.log(`# Removed "${key}" from "${file.path}".`));
    cleaner.on('passed', ({ key, file }) => console.log(`# Passed "${key}" from "${file.path}".`));
    const keys = deserializeKeys(params.input);
    const translations = loadTranslations(params.translations);
    const cleaned = cleaner.clean(keys, translations);
    cleaned.forEach(file => saveTranslation(file));
    cleaner.removeAllListeners();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  params.input = readFileSync((process.stdin as any).fd, 'utf8');

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}
