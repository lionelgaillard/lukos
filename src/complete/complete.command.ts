import { Readable } from 'stream';
import { read } from '../stream';
import { ComparedTranslationFile } from '../translations';
import { Completer } from './completer';

export class CompleteCommand {
  constructor(private readonly completer: Completer) {}

  public async run(input: Readable) {
    const diff = ComparedTranslationFile.deserialize(await read(input));
    const completed = await this.completer.complete(diff);
  }
}
