import { TranslationFile } from '../translations';

export function rename(from: string, to: string, translations: TranslationFile[]) {
  for (const translation of translations) {
    const value = translation.get(from);
    if (value) {
      if (translation.has(to)) {
        translation.delete(to);
      }

      translation.add(to, value);
    }
    translation.delete(from);
  }
}
