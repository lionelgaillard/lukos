import { EventEmitter } from 'events';
import { File } from '../files';
import { TranslationFile } from '../translations';

export class Checker extends EventEmitter {
  public check(translations: TranslationFile[], sources: File[]): string[] {
    const unused: string[] = [];
    const keys = getAllKeys(translations);

    this.emit('checking', { keys, sources, translations });

    for (const key of keys) {
      const source = findUsage(key, sources);
      if (source) {
        this.emit('used', { key, source });
      } else {
        unused.push(key);
        this.emit('unused', { key, sources });
      }
    }

    this.emit('checked', { unused });

    return unused;
  }
}

function getAllKeys(translations: TranslationFile[]) {
  return [...new Set(translations.map(t => t.keys).flat(1))];
}

function findUsage(key: string, sources: File[]) {
  return sources.find(file => file.content.match(new RegExp(key)));
}
