import * as minimist from 'minimist';
import { deserializeKeys } from '../common/keys';
import { input, log, output } from '../common/standard';
import { loadTranslations } from '../common/translations';
import { pick } from './pick';

interface Params {
  translations: string;
}

(async function main() {
  try {
    const params = getParams();
    const keys = deserializeKeys(await input());
    const translations = await loadTranslations(params.translations);
    const picked = pick(keys, translations);
    await output(JSON.stringify(picked, null, 2));
    process.exit(0);
  } catch (error) {
    await log(error.message);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}
