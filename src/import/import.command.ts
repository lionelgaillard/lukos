import { Readable } from 'stream';
import { read } from '../stream';
import { Importer } from './importer';

export class ImportCommand {
  constructor(private readonly importer: Importer) {}

  public async run(input: Readable) {
    const content = await read(input);
    const files = this.importer.import(content);
    files.forEach(file => file.save());
  }
}
