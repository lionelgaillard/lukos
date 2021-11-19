import { Writable } from 'stream';
import { toCsv } from '../csv';
import { TranslationFile } from '../translations';

export class ExportCommand {
  public async run(output: Writable, translationsGlob: string) {
    const files = TranslationFile.fromGlob(translationsGlob);
    const values = TranslationFile.toValues(files);
    output.write(toCsv(values), 'utf8');
  }
}
