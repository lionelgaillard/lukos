import { Writable } from 'stream';
import { loadTranslations } from '../translations';
import { toCsv } from './csv';

export class ExportCommand {
  public async run(output: Writable, translationsGlob: string) {
    const files = await loadTranslations(translationsGlob);
    output.write(toCsv(files));
  }
}
