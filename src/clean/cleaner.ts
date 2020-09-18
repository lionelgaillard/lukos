import { EventEmitter } from 'events';
import { TranslationFile } from '../translations';

export class Cleaner extends EventEmitter {
  public async clean(keys: string[], translations: TranslationFile[]) {
    this.emit('cleaning', { keys, translations });

    for (const file of translations) {
      for (const key of keys) {
        if (file.delete(key)) {
          this.emit('removed', { key, file });
        } else {
          this.emit('passed', { key, file });
        }
      }
    }

    this.emit('cleaned', { keys, translations });

    return translations;
  }
}
