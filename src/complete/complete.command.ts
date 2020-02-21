import * as minimist from 'minimist';
import { input, log } from '../common/standard';
import { deserializeComparedTranslations, loadTranslation, saveTranslation } from '../common/translations';
import { Completer } from './completer';

interface Params {
  reference: string;
}

(async function main() {
  try {
    const params = getParams();
    const completer = new Completer();
    completer.on('completing', ({ reference, translations }) =>
      log(`Completing ${translations.length} files with values of ${reference.path}...`)
    );
    completer.on('added', ({ file, key }) => log(`Added ${key} in ${file.path}`));
    completer.on('passed', ({ file, key }) => log(`Passed ${key} in ${file.path}`));
    const diff = await deserializeComparedTranslations(await input());
    const reference = await loadTranslation(params.reference);
    const completed = await completer.complete(diff, reference);
    await Promise.all(completed.map(file => saveTranslation(file)));
    completer.removeAllListeners();
    process.exit(0);
  } catch (error) {
    await log(error.message);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  if (!params.reference) {
    throw new Error('--reference required');
  }

  return params;
}
