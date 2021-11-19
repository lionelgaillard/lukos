import { Writable } from 'stream';
import { toCsv } from '../csv';
import { TranslationFile } from '../translations';

export class ExportCommand {
  public async run(output: Writable, translationsGlob: string) {
    const translations = TranslationFile.fromGlob(translationsGlob);
    output.write(toCsv(translations), 'utf8');
  }
}
