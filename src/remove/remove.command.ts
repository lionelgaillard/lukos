import { Readable } from 'stream';
import { deserializeKeys } from '../keys';
import { read } from '../stream';
import { loadTranslations, saveTranslation } from '../translations';
import { Remover } from './remover';

export class CleanCommand {
  constructor(private readonly remover: Remover) {}

  public async run(input: Readable, translationsGlob: string) {
    const keys = deserializeKeys(await read(input));
    const translations = await loadTranslations(translationsGlob);
    this.remover.remove(keys, translations);
    await Promise.all(translations.map(file => saveTranslation(file)));
  }
}
