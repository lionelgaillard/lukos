import * as minimist from 'minimist';
import { Completer } from './completer';

interface Params {
  reference: string;
  diff: string;
}

(function main() {
  const params = getParams();
  const completer = new Completer();
  completer.on('completing', ({ reference, translations }) =>
    console.log(`Completing ${translations.length} files with values of ${reference.path}...`)
  );
  completer.on('added', ({ file, key }) => console.log(`Added ${key} in ${file.path}`));
  completer.on('passed', ({ file, key }) => console.log(`Passed ${key} in ${file.path}`));
  completer.complete(params.reference, params.diff);
  completer.removeAllListeners();
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  if (!params.reference) {
    throw new Error('--reference required');
  }

  if (!params.diff) {
    params.diff = './compared.txt';
  }

  return params;
}
