import { Readable } from 'stream';
import { read } from '../stream';
import { deserializeComparedTranslations, saveTranslation } from '../translations';
import { Completer } from './completer';

export class CompleteCommand {
  constructor(private readonly completer: Completer) {}

  public async run(input: Readable) {
    const diff = await deserializeComparedTranslations(await read(input));
    const completed = await this.completer.complete(diff);
    await Promise.all(completed.map(file => saveTranslation(file)));
  }
}
