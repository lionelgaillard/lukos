import { EventEmitter } from 'events';
import { ComparedTranslationFile, TranslationFile } from '../translations';

export class Comparer extends EventEmitter {
  public compare(reference: TranslationFile, translations: TranslationFile[]): ComparedTranslationFile[] {
    const compared: ComparedTranslationFile[] = [];

    this.emit('comparing', { reference, translations });

    for (const file of translations) {
      const diff = reference.compare(file);
      compared.push(diff);
      this.emit('diff', { file: diff });
    }

    this.emit('compared', { reference, translations: compared });

    return compared;
  }
}
