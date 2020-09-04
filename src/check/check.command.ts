import { Writable } from 'stream';
import { loadFiles } from '../files';
import { serializeKeys } from '../keys';
import { write } from '../stream';
import { loadTranslations } from '../translations';
import { Checker } from './checker';

export class CheckCommand {
  constructor(private readonly checker: Checker) {}

  public async run(output: Writable, sourcesGlob: string, translationsGlob: string) {
    const sources = await loadFiles(sourcesGlob);
    const translations = await loadTranslations(translationsGlob);
    const unused = await this.checker.check(translations, sources);
    await write(output, serializeKeys(unused));
  }
}
