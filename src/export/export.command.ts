import { Writable } from 'stream';
import { toCsv } from '../csv';
import { loadTranslations } from '../translations';

export class ExportCommand {
  public async run(output: Writable, translationsGlob: string) {
    const files = await loadTranslations(translationsGlob);
    output.write(toCsv(files), 'utf8');
  }
}
