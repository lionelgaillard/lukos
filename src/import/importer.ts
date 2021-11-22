import { fromCsv } from '../csv';
import { TranslationFile } from '../translations';

export class Importer {
  public import(content: string): TranslationFile[] {
    const values = fromCsv(content);
    const files = TranslationFile.fromValues(values);
    return files;
  }
}
