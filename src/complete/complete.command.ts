import * as minimist from 'minimist';
import { input, print, printFile } from '../common/standard';
import { deserializeComparedTranslations, loadTranslation, saveTranslation } from '../common/translations';
import { Completer } from './completer';

interface Arguments {
  help: boolean;
  reference: string;
}

(async function main() {
  try {
    const args = getArguments();

    if (args.help) {
      await printFile(`${__dirname}/README.md`);
      process.exit(0);
    }

    const completer = new Completer();
    completer.on('completing', ({ reference, translations }) =>
      print(`Completing ${translations.length} files with values of ${reference.path}...`)
    );
    completer.on('added', ({ file, key }) => print(`Added ${key} in ${file.path}`));
    completer.on('passed', ({ file, key }) => print(`Passed ${key} in ${file.path}`));
    const diff = await deserializeComparedTranslations(await input());
    const reference = await loadTranslation(args.reference);
    const completed = await completer.complete(diff, reference);
    await Promise.all(completed.map(file => saveTranslation(file)));
    completer.removeAllListeners();
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

  return args;
}
