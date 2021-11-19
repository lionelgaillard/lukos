import { Readable } from 'stream';
import { deserializeKeys } from '../keys';
import { Remover } from '../remove/remover';
import { read } from '../stream';
import { TranslationFile } from '../translations';

export class CleanCommand {
  constructor(private readonly remover: Remover) {}

  public async run(input: Readable, translationsGlob: string) {
    const keys = deserializeKeys(await read(input));
    const translations = TranslationFile.fromGlob(translationsGlob);
    this.remover.remove(keys, translations);
    translations.map(file => file.save());
  }
}
