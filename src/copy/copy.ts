import { TranslationFile } from '../translations';

export function copy(source: string, target: string, translations: TranslationFile[]) {
  for (const translation of translations) {
    const value = translation.get(source);
    if (value) {
      if (translation.has(target)) {
        translation.delete(target);
      }
      translation.add(target, value);
    }
  }
}
