import { EventEmitter } from 'events';
import { addTranslationKey, ComparedTranslationFile, getTranslationValue } from '../translations';

export class Completer extends EventEmitter {
  public async complete(translations: ComparedTranslationFile[]) {
    if (translations.length === 0) {
      return translations;
    }

    this.emit('completing', { reference: translations[0].reference, translations });

    for (const file of translations) {
      for (const key of file.substractions) {
        const value = getTranslationValue(file.reference.data, key);
        if (addTranslationKey(file.data, key, value)) {
          file.keys.push(key);
          this.emit('added', { file, key, value });
        } else {
          this.emit('passed', { file, key, value });
        }
      }
    }

    this.emit('completed', { reference: translations[0].reference, translations });

    return translations;
  }
}
