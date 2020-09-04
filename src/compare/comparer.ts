import { EventEmitter } from 'events';
import { tick } from '../async';
import { ComparedTranslationFile, compareTranslation, TranslationFile } from '../translations';

export class Comparer extends EventEmitter {
  public async compare(reference: TranslationFile, translations: TranslationFile[]) {
    const compared: ComparedTranslationFile[] = [];

    this.emit('comparing', { reference, translations });
    await tick();

    for (const file of translations) {
      const diffed = compareTranslation(reference, file);
      compared.push(diffed);
      this.emit('diff', { file: diffed });
      await tick();
    }

    this.emit('compared', { reference, translations: compared });
    await tick();

    return compared;
  }
}
