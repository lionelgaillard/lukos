import { TranslationFile } from '../translations';
import { Renamer } from './renamer';

export class RenameCommand {
  constructor(private readonly renamer: Renamer) {}

  public async run(source: string, target: string, translationsGlob: string) {
    const translations = TranslationFile.fromGlob(translationsGlob);
    this.renamer.rename(source, target, translations);
    translations.map(t => t.save());
  }
}
