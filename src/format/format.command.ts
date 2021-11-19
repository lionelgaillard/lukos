import { TranslationFile } from '../translations';

export class FormatCommand {
  public async run(translationsGlob: string) {
    TranslationFile.fromGlob(translationsGlob).map(t => t.save());
  }
}
