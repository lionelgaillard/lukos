import * as minimist from 'minimist';
import { deserializeKeys } from '../common/keys';
import { input, print, printFile } from '../common/standard';
import { loadTranslations, saveTranslation } from '../common/translations';
import { Cleaner } from './cleaner';

interface Arguments {
  help: boolean;
  keys: string;
  translations: string;
}

(async function main() {
  try {
    const args = getArguments();

    if (args.help) {
      await printFile(`${__dirname}/README.md`);
      process.exit(0);
    }

    const cleaner = new Cleaner();
    cleaner.on('cleaning', ({ keys, translations }) => print(`Removing ${keys.length} keys from ${translations.length} files...`));
    cleaner.on('removed', ({ key, file }) => print(`Removed "${key}" from "${file.path}".`));
    cleaner.on('passed', ({ key, file }) => print(`Passed "${key}" from "${file.path}".`));
    const keys = deserializeKeys(await input());
    const translations = await loadTranslations(args.translations);
    const cleaned = await cleaner.clean(keys, translations);
    await Promise.all(cleaned.map(file => saveTranslation(file)));
    cleaner.removeAllListeners();
    process.exit(0);
  } catch (error) {
    await print(error.message);
    process.exit(1);
  }
})();

function getArguments() {
  const args = minimist(process.argv.slice(2)) as Arguments;

  if (args.help) {
    return args;
  }

  if (!args.translations) {
    throw new Error('--translations required');
  }

  return args;
}
