import { EventEmitter } from 'events';
import { ComparedTranslationFile, compareTranslation, TranslationFile } from '../translations';

export class Comparer extends EventEmitter {
  public async compare(reference: TranslationFile, translations: TranslationFile[]) {
    const compared: ComparedTranslationFile[] = [];

    this.emit('comparing', { reference, translations });

    for (const file of translations) {
      const diffed = compareTranslation(reference, file);
      compared.push(diffed);
      this.emit('diff', { file: diffed });
    }

    this.emit('compared', { reference, translations: compared });

    return compared;
  }
}
