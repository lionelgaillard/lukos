import { Writable } from 'stream';
import { TranslationFile } from '../translations';
import { Exporter } from './exporter';

export class ExportCommand {
  constructor(private readonly exporter: Exporter) {}

  public async run(output: Writable, translationsGlob: string) {
    const files = TranslationFile.fromGlob(translationsGlob);
    const content = this.exporter.export(files);
    output.write(content, 'utf8');
  }
}
