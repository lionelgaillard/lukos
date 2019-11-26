import { EventEmitter } from 'events';
import { compareTranslation, loadTranslation, loadTranslations, saveComparedTranslation } from '../common/translations';

export class Comparer extends EventEmitter {
  public compare(referencePath: string, translationsGlob: string, outputPath: string) {
    const reference = loadTranslation(referencePath);
    const translations = loadTranslations(translationsGlob);

    this.emit('comparing', { reference, translations });
    const compared = translations.map(file => {
      const diffed = compareTranslation(reference, file);
      this.emit('diff', { file: diffed });
      return diffed;
    });
    this.emit('compared', { reference, translations: compared });
    saveComparedTranslation(outputPath, compared);
    return compared;
  }
}
