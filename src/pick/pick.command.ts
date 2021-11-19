import { Readable, Writable } from 'stream';
import { deserializeKeys } from '../keys';
import { read, write } from '../stream';
import { TranslationFile } from '../translations';
import { pick } from './pick';

export class PickCommand {
  public async run(input: Readable, output: Writable, translationsGlob: string) {
    const keys = deserializeKeys(await read(input));
    const translations = TranslationFile.fromGlob(translationsGlob);
    const picked = pick(keys, translations);
    await write(output, JSON.stringify(picked, null, 2));
  }
}
