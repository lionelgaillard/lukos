import { EventEmitter } from 'events';
import { compareTranslation, TranslationFile } from '../common/translations';

export class Comparer extends EventEmitter {
  public compare(reference: TranslationFile, translations: TranslationFile[]) {
    this.emit('comparing', { reference, translations });
    const compared = translations.map(file => {
      const diffed = compareTranslation(reference, file);
      this.emit('diff', { file: diffed });
      return diffed;
    });
    this.emit('compared', { reference, translations: compared });
    return compared;
  }
}
