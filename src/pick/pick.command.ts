import { readFileSync } from 'fs-extra';
import * as minimist from 'minimist';
import { Writable } from 'stream';
import { deserializeKeys } from '../common/keys';
import { getTranslationValue, loadTranslations, TranslationFile } from '../common/translations';

interface Params {
  input: string;
  output: Writable;
  translations: string;
}

(function main() {
  const params = getParams();
  const keys = deserializeKeys(params.input);
  const translations = loadTranslations(params.translations);
  const picked = pick(keys, translations);
  params.output.write(JSON.stringify(picked, null, '  '));
})();

function getParams() {
  const params = minimist(process.argv.slice(2)) as Params;
  params.input = readFileSync((process.stdin as any).fd, 'utf8');
  params.output = process.stdout;

  if (!params.translations) {
    throw new Error('--translations required');
  }

  return params;
}

function pick(keys: string[], translations: TranslationFile[]) {
  const picked = {};
  keys.forEach(key => {
    picked[key] = {};
    translations.forEach(translation => {
      picked[key][translation.path] = getTranslationValue(translation.data, key);
    });
  });
  return picked;
}
