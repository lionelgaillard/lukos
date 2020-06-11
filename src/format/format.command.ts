import * as minimist from 'minimist';
import { print, printFile } from '../common/standard';
import { loadTranslations, saveTranslation } from '../common/translations';

interface Arguments {
  help: boolean;
  translations: string;
}

(async function main() {
  try {
    const args = getArguments();

    if (args.help) {
      await printFile(`${__dirname}/README.md`);
      process.exit(0);
    }

    const translations = await loadTranslations(args.translations);
    await Promise.all(translations.map(t => saveTranslation(t)));
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
