import { loadTranslations, saveTranslations } from '../translations';
import { Renamer } from './renamer';

export class RenameCommand {
  constructor(private readonly renamer: Renamer) {}

  public async run(source: string, target: string, translationsGlob: string) {
    const translations = await loadTranslations(translationsGlob);
    this.renamer.rename(source, target, translations);
    await saveTranslations(translations);
  }
}
