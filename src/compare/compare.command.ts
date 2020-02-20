import * as minimist from 'minimist';
import { Writable } from 'stream';
import { loadTranslation, loadTranslations, serializeComparedTranslation } from '../common/translations';
import { Comparer } from './comparer';

interface Params {
  reference: string;
  translations: string;
  output: Writable;
}

(function main() {
  try {
    const params = getParams();
    const comparer = new Comparer();
    comparer.on('comparing', ({ reference, translations }) =>
      console.log(`### Comparing ${reference.path} with ${translations.length} files...`)
    );
    comparer.on('diff', ({ file }) => console.log(`### ${file.path} +${file.additions.length} -${file.substractions.length}`));
    const reference = loadTranslation(params.reference);
    const translations = loadTranslations(params.translations);
    const compared = comparer.compare(reference, translations);
    params.output.write(serializeComparedTranslation(compared));
    comparer.removeAllListeners();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  params.output = process.stdout;

  if (!params.reference) {
    throw new Error('--reference required');
  }

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}
