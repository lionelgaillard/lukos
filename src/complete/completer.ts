import { EventEmitter } from 'events';
import { addTranslationKey, ComparedTranslationFile, getTranslationValue, TranslationFile } from '../common/translations';

export class Completer extends EventEmitter {
  public complete(translations: ComparedTranslationFile[], reference: TranslationFile) {
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
    });
    this.emit('completed', { reference, translations });
    return translations;
  }
}
