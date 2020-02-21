import * as minimist from 'minimist';
import { loadFiles } from '../common/files';
import { serializeKeys } from '../common/keys';
import { output, print, printFile } from '../common/standard';
import { loadTranslations } from '../common/translations';
import { Checker } from './checker';

interface Arguments {
  help: boolean;
  sources: string;
  translations: string;
}

(async function main() {
  try {
    const args = getArguments();

    if (args.help) {
      await printFile(`${__dirname}/README.md`);
      process.exit(0);
    }

    const checker = new Checker();
    checker.on('checking', ({ keys, sources }) => print(`Checking ${keys.length} keys in ${sources.length} files...`));
    checker.on('checked', ({ unused }) => print(`Found ${unused.length} unused keys`));
    // checker.on('used', ({ key, source }) => log(`${key} is used by ${source.path}`));
    // checker.on('unused', ({ key }) => log(`${key} is unused`));
    const sources = await loadFiles(args.sources);
    const translations = await loadTranslations(args.translations);
    const unused = await checker.check(translations, sources);
    await output(serializeKeys(unused));
    checker.removeAllListeners();
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

  if (!args.sources) {
    throw new Error('--sources required');
  }

  if (!args.translations) {
    throw new Error('--translations required');
  }

  return args;
}
