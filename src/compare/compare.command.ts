import * as minimist from 'minimist';
import { Comparer } from './comparer';

interface Params {
  reference: string;
  translations: string;
  output: string;
}

(function main() {
  const params = getParams();
  const comparer = new Comparer();
  comparer.on('comparing', ({ reference, translations }) =>
    console.log(`Comparing ${reference.path} with ${translations.length} files...`)
  );
  comparer.on('diff', ({ file }) => console.log(`${file.path} +${file.additions.length} -${file.substractions.length}`));
  comparer.compare(params.reference, params.translations, params.output);
  comparer.removeAllListeners();
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  if (!params.output) {
    params.output = './compared.txt';
  }

  if (!params.reference) {
    throw new Error('--reference required');
  }

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}
