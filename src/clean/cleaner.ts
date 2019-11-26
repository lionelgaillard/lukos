import { EventEmitter } from 'events';
import { readFileSync } from 'fs-extra';
import { resolvePaths } from '../common/files';
import { deleteTranslationKey, loadTranslations, saveTranslation } from '../common/translations';

export class Cleaner extends EventEmitter {
  public clean(keysPath: string, translationsGlob: string) {
    const keys = this.getUnusedKeys(keysPath);
    const translations = this.getTranslations(translationsGlob);

    this.emit('cleaning', { keys, translations });
    for (let file of translations) {
      for (let key of keys) {
        if (deleteTranslationKey(file.data, key)) {
          this.emit('removed', { key, file });
        } else {
          this.emit('passed', { key, file });
        }
      }
      saveTranslation(file);
    }
    this.emit('cleaned', { keys, translations });
  }

  private getUnusedKeys(path: string) {
    return readFileSync(path, 'utf-8')
      .split('\n')
      .map(k => k.trim())
      .filter(Boolean);
  }

  private getTranslations(translationsGlob: string) {
    return loadTranslations(resolvePaths(translationsGlob));
  }
}
