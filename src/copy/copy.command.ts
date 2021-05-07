import { loadTranslations, saveTranslations } from '../translations';
import { copy } from './copy';

export class CopyCommand {
  public async run(source: string, target: string, translationsGlob: string) {
    const translations = await loadTranslations(translationsGlob);
    await copy(source, target, translations);
    await saveTranslations(translations);
  }
}
