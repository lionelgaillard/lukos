import { TranslationFile } from '../translations';
import { Copier } from './copier';

export class CopyCommand {
  constructor(private readonly copier: Copier) {}

  public async run(source: string, target: string, translationsGlob: string) {
    const translations = TranslationFile.fromGlob(translationsGlob);
    this.copier.copy(source, target, translations);
    translations.map(t => t.save());
  }
}
