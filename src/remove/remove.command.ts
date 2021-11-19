import { TranslationFile } from '../translations';
import { Remover } from './remover';

export class RemoveCommand {
  constructor(private readonly remover: Remover) {}

  public async run(keys: string[], translationsGlob: string) {
    const translations = TranslationFile.fromGlob(translationsGlob);
    this.remover.remove(keys, translations);
    translations.map(file => file.save());
  }
}
