import { loadTranslations, saveTranslations } from '../translations';

export class FormatCommand {
  public async run(translationsGlob: string) {
    await saveTranslations(await loadTranslations(translationsGlob));
  }
}
