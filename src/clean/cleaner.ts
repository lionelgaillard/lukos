import { EventEmitter } from 'events';
import { loadKeys } from '../common/keys';
import { deleteTranslationKey, loadTranslations, saveTranslation } from '../common/translations';

export class Cleaner extends EventEmitter {
  public clean(keysPath: string, translationsGlob: string) {
    const keys = loadKeys(keysPath);
    const translations = loadTranslations(translationsGlob);

    this.emit('cleaning', { keys, translations });
    translations.forEach(file => {
      keys.forEach(key => {
        if (deleteTranslationKey(file.data, key)) {
          this.emit('removed', { key, file });
        } else {
          this.emit('passed', { key, file });
        }
      });
      saveTranslation(file);
    });
    this.emit('cleaned', { keys, translations });
  }
}
