import { EventEmitter } from 'events';
import { deleteTranslationKey, TranslationFile } from '../common/translations';

export class Cleaner extends EventEmitter {
  public clean(keys: string[], translations: TranslationFile[]) {
    this.emit('cleaning', { keys, translations });
    translations.forEach(file => {
      keys.forEach(key => {
        if (deleteTranslationKey(file.data, key)) {
          this.emit('removed', { key, file });
        } else {
          this.emit('passed', { key, file });
        }
      });
    });
    this.emit('cleaned', { keys, translations });
    return translations;
  }
}
