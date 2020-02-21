import * as minimist from 'minimist';
import { log, output } from '../common/standard';
import { loadTranslation, loadTranslations, serializeComparedTranslation } from '../common/translations';
import { Comparer } from './comparer';

interface Params {
  reference: string;
  translations: string;
}

(async function main() {
  try {
    const params = getParams();
    const comparer = new Comparer();
    comparer.on('comparing', ({ reference, translations }) => log(`Comparing ${reference.path} with ${translations.length} files...`));
    comparer.on('diff', ({ file }) => log(`${file.path} +${file.additions.length} -${file.substractions.length}`));
    const reference = await loadTranslation(params.reference);
    const translations = await loadTranslations(params.translations);
    const compared = await comparer.compare(reference, translations);
    await output(serializeComparedTranslation(compared));
    comparer.removeAllListeners();
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

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}
