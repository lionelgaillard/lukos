import { Writable } from 'stream';
import { File } from '../files';
import { serializeKeys } from '../keys';
import { write } from '../stream';
import { TranslationFile } from '../translations';
import { Checker } from './checker';

export class CheckCommand {
  constructor(private readonly checker: Checker) {}

  public async run(output: Writable, sourcesGlob: string, translationsGlob: string) {
    const sources = File.fromGlob(sourcesGlob);
    const translations = TranslationFile.fromGlob(translationsGlob);
    const unused = this.checker.check(translations, sources);
    await write(output, serializeKeys(unused));
  }
}
