import { EventEmitter } from 'events';
import { tick } from '../common/standard';
import { deleteTranslationKey, TranslationFile } from '../common/translations';

export class Cleaner extends EventEmitter {
  public async clean(keys: string[], translations: TranslationFile[]) {
    this.emit('cleaning', { keys, translations });
    await tick();

    for (const file of translations) {
      for (const key of keys) {
        if (deleteTranslationKey(file.data, key)) {
          this.emit('removed', { key, file });
          await tick();
        } else {
          this.emit('passed', { key, file });
          await tick();
        }
      }
    }

    this.emit('cleaned', { keys, translations });
    await tick();

    return translations;
  }
}
