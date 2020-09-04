import { Readable } from 'stream';
import { read } from '../stream';
import { deserializeComparedTranslations, loadTranslation, saveTranslation } from '../translations';
import { Completer } from './completer';

export class CompleteCommand {
  constructor(private readonly completer: Completer) {}

  public async run(input: Readable, referencePath: string) {
    const diff = await deserializeComparedTranslations(await read(input));
    const reference = await loadTranslation(referencePath);
    const completed = await this.completer.complete(diff, reference);
    await Promise.all(completed.map(file => saveTranslation(file)));
  }
}
