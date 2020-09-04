import { Readable } from 'stream';
import { deserializeKeys } from '../keys';
import { read } from '../stream';
import { loadTranslations, saveTranslation } from '../translations';
import { Cleaner } from './cleaner';

export class CleanCommand {
  constructor(private readonly cleaner: Cleaner) {}

  public async run(input: Readable, translationsGlob: string) {
    const keys = deserializeKeys(await read(input));
    const translations = await loadTranslations(translationsGlob);
    const cleaned = await this.cleaner.clean(keys, translations);
    await Promise.all(cleaned.map(file => saveTranslation(file)));
  }
}
