import * as minimist from 'minimist';
import { Writable } from 'stream';
import { loadFiles } from '../common/files';
import { serializeKeys } from '../common/keys';
import { loadTranslations } from '../common/translations';
import { Checker } from './checker';

interface Params {
  output: Writable;
  sources: string;
  translations: string;
}

(function main() {
  try {
    const params = getParams();
    const checker = new Checker();
    checker.on('checking', ({ keys, sources }) => console.log(`# Checking ${keys.length} keys in ${sources.length} files...`));
    checker.on('checked', ({ unused }) => console.log(`# Found ${unused.length} unused keys`));
    // checker.on('used', ({ key, source }) => console.log(`# ${key} is used by ${source.path}`));
    // checker.on('unused', ({ key }) => console.log(`# ${key} is unused`));
    const sources = loadFiles(params.sources);
    const translations = loadTranslations(params.translations);
    const unused = checker.check(translations, sources);
    params.output.write(serializeKeys(unused));
    checker.removeAllListeners();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;

  params.output = process.stdout;

  if (!params.sources) {
    throw new Error('--sources required');
  }

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}
