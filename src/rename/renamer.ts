import { EventEmitter } from 'events';
import { TranslationFile } from '../translations';

export class Renamer extends EventEmitter {
  public rename(source: string, target: string, translations: TranslationFile[]): void {
    this.emit('rename.pre', { source, target, translations });

    for (const translation of translations) {
      const value = translation.get(source);
      if (value) {
        if (translation.has(target)) {
          translation.delete(target);
        }
        translation.add(target, value);
        translation.delete(source);
        this.emit('renamed', { source, target, translation });
      } else {
        this.emit('passed', { source, target, translation });
      }
    }

    this.emit('rename.post', { source, target, translations });
  }
}
