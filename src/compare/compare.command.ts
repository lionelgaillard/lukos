import * as minimist from 'minimist';
import { output, print, printFile } from '../common/standard';
import { loadTranslation, loadTranslations, serializeComparedTranslation } from '../common/translations';
import { Comparer } from './comparer';

interface Arguments {
  help: boolean;
  reference: string;
  translations: string;
}

(async function main() {
  try {
    const args = getArguments();

    if (args.help) {
      await printFile(`${__dirname}/README.md`);
      process.exit(0);
    }

    const comparer = new Comparer();
    comparer.on('comparing', ({ reference, translations }) => print(`Comparing ${reference.path} with ${translations.length} files...`));
    comparer.on('diff', ({ file }) => print(`${file.path} +${file.additions.length} -${file.substractions.length}`));
    const reference = await loadTranslation(args.reference);
    const translations = await loadTranslations(args.translations);
    const compared = await comparer.compare(reference, translations);
    await output(serializeComparedTranslation(compared));
    comparer.removeAllListeners();
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

  if (!args.reference) {
    throw new Error('--reference required');
  }

  if (!args.translations) {
    throw new Error('--translations required');
  }

  return args;
}
