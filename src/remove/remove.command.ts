import { loadTranslations, saveTranslation } from '../translations';
import { Remover } from './remover';

export class RemoveCommand {
  constructor(private readonly remover: Remover) {}

  public async run(keys: string[], translationsGlob: string) {
    const translations = await loadTranslations(translationsGlob);
    this.remover.remove(keys, translations);
    await Promise.all(translations.map(file => saveTranslation(file)));
  }
}
