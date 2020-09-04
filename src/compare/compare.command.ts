import { Writable } from 'stream';
import { write } from '../stream';
import { loadTranslation, loadTranslations, serializeComparedTranslation } from '../translations';
import { Comparer } from './comparer';

export class CompareCommand {
  constructor(private readonly comparer: Comparer) {}

  public async run(output: Writable, referencePath: string, translationsGlob: string) {
    const reference = await loadTranslation(referencePath);
    const translations = await loadTranslations(translationsGlob);
    const compared = await this.comparer.compare(reference, translations);
    await write(output, serializeComparedTranslation(compared));
  }
}
