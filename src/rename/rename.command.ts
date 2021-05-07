import { loadTranslations } from '../translations';
import { rename } from './rename';

export class RenameCommand {
  public async run(from: string, to: string, translationsGlob: string) {
    const translations = await loadTranslations(translationsGlob);
    await rename(from, to, translations);
    for (const translation of translations) {
      await translation.save();
    }
  }
}
