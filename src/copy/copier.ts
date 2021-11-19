import { EventEmitter } from 'events';
import { TranslationFile } from '../translations';

export class Copier extends EventEmitter {
  public copy(source: string, target: string, translations: TranslationFile[]): void {
    this.emit('copy.pre', { source, target, translations });

    for (const translation of translations) {
      const value = translation.get(source);
      if (value) {
        if (translation.has(target)) {
          translation.delete(target);
        }
        translation.add(target, value);
        this.emit('copied', { source, target, translation });
      }
    }

    this.emit('copy.post', { source, target, translations });
  }
}
