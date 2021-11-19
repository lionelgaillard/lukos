import { Writable } from 'stream';
import { TranslationFile } from '../translations';

export class KeysCommand {
  public async run(output: Writable, translationsGlob: string) {
    const translations = TranslationFile.fromGlob(translationsGlob);
    const keys = new Set();

    for (let translation of translations) {
      for (let key of translation.keys) {
        keys.add(key);
      }
    }

    for (let key of keys) {
      output.write(`${key}\n`);
    }
  }
}
