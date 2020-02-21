import * as minimist from 'minimist';
import { deserializeKeys } from '../common/keys';
import { input, output, print, printFile } from '../common/standard';
import { loadTranslations } from '../common/translations';
import { pick } from './pick';

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

    const keys = deserializeKeys(await input());
    const translations = await loadTranslations(args.translations);
    const picked = pick(keys, translations);
    await output(JSON.stringify(picked, null, 2));
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
