import { readFileSync } from 'fs-extra';
import * as minimist from 'minimist';
import { deserializeComparedTranslations, loadTranslation, saveTranslation } from '../common/translations';
import { Completer } from './completer';

interface Params {
  input: string;
  reference: string;
}

(function main() {
  try {
    const params = getParams();
    const completer = new Completer();
    completer.on('completing', ({ reference, translations }) =>
      console.log(`### Completing ${translations.length} files with values of ${reference.path}...`)
    );
    completer.on('added', ({ file, key }) => console.log(`### Added ${key} in ${file.path}`));
    completer.on('passed', ({ file, key }) => console.log(`### Passed ${key} in ${file.path}`));
    const diff = deserializeComparedTranslations(params.input);
    const reference = loadTranslation(params.reference);
    const completed = completer.complete(diff, reference);
    completed.forEach(file => saveTranslation(file));
    completer.removeAllListeners();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  params.input = readFileSync((process.stdin as any).fd, 'utf8');

  if (!params.reference) {
    throw new Error('--reference required');
  }

  return params;
}
