import { EventEmitter } from 'events';
import { tick } from '../common/standard';
import { addTranslationKey, ComparedTranslationFile, getTranslationValue, TranslationFile } from '../common/translations';

export class Completer extends EventEmitter {
  public async complete(translations: ComparedTranslationFile[], reference: TranslationFile) {
    this.emit('completing', { reference, translations });
    await tick();

    for (const file of translations) {
      for (const key of file.substractions) {
        const value = getTranslationValue(reference.data, key);
        if (addTranslationKey(file.data, key, value)) {
          file.keys.push(key);
          this.emit('added', { file, key, value });
          await tick();
        } else {
          this.emit('passed', { file, key, value });
          await tick();
        }
      }
    }

    this.emit('completed', { reference, translations });
    await tick();

    return translations;
  }
}
