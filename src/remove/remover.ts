import { EventEmitter } from 'events';
import { TranslationFile } from '../translations';

export class Remover extends EventEmitter {
  public async clean(keys: string[], translations: TranslationFile[]) {
    this.emit('remove.pre', { keys, translations });

    for (const file of translations) {
      for (const key of keys) {
        if (file.delete(key)) {
          this.emit('removed', { key, file });
        } else {
          this.emit('passed', { key, file });
        }
      }
    }

    this.emit('remove.post', { keys, translations });

    return translations;
  }
}
