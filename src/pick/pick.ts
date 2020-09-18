import { TranslationFile } from '../translations';

export function pick(keys: string[], translations: TranslationFile[]) {
  const picked = {};
  keys.forEach(key => {
    picked[key] = {};
    translations.forEach(translation => {
      picked[key][translation.path] = translation.get(key);
    });
  });
  return picked;
}
