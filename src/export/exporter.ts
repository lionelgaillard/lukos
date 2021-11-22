import { toCsv } from '../csv';
import { TranslationFile } from '../translations';

export class Exporter {
  public export(files: TranslationFile[]): string {
    const values = TranslationFile.toValues(files);
    const content = toCsv(values);
    return content;
  }
}
