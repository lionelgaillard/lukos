import { EventEmitter } from 'events';
import { addTranslationKey, getTranslationValue, loadComparedTranslations, loadTranslation, saveTranslation } from '../common/translations';

export class Completer extends EventEmitter {
  public complete(referencePath: string, diffPath: string) {
    const reference = loadTranslation(referencePath);
    const translations = loadComparedTranslations(diffPath);

    this.emit('completing', { reference, translations });
    translations.forEach(file => {
      file.substractions.forEach(key => {
        const value = getTranslationValue(reference.data, key);
        if (addTranslationKey(file.data, key, value)) {
          this.emit('added', { file, key, value });
          file.keys.push(key);
        } else {
          this.emit('passed', { file, key, value });
        }
      });
      saveTranslation(file);
    });
    this.emit('completed', { reference, translations });
    return translations;
  }
}
