import * as minimist from 'minimist';
import { loadFiles } from '../common/files';
import { serializeKeys } from '../common/keys';
import { log, output } from '../common/standard';
import { loadTranslations } from '../common/translations';
import { Checker } from './checker';

interface Params {
  sources: string;
  translations: string;
}

(async function main() {
  try {
    const params = getParams();
    const checker = new Checker();
    checker.on('checking', ({ keys, sources }) => log(`Checking ${keys.length} keys in ${sources.length} files...`));
    checker.on('checked', ({ unused }) => log(`Found ${unused.length} unused keys`));
    // checker.on('used', ({ key, source }) => log(`${key} is used by ${source.path}`));
    // checker.on('unused', ({ key }) => log(`${key} is unused`));
    const sources = loadFiles(params.sources);
    const translations = loadTranslations(params.translations);
    const unused = await checker.check(translations, sources);
    await output(serializeKeys(unused));
    checker.removeAllListeners();
    process.exit(0);
  } catch (error) {
    await log(error.message);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  if (!params.sources) {
    throw new Error('--sources required');
  }

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}
