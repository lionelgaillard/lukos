import { Writable } from 'stream';
import { write } from '../stream';
import { ComparedTranslationFile, TranslationFile } from '../translations';
import { Comparer } from './comparer';

export class CompareCommand {
  constructor(private readonly comparer: Comparer) {}

  public async run(output: Writable, referencePath: string, translationsGlob: string) {
    const reference = TranslationFile.fromPath(referencePath);
    const translations = TranslationFile.fromGlob(translationsGlob);
    const compared = this.comparer.compare(reference, translations);
    await write(output, ComparedTranslationFile.serialize(compared));
  }
}
