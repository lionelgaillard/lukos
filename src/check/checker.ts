import { EventEmitter } from 'events';
import { File } from '../common/files';
import { TranslationFile } from '../common/translations';

export class Checker extends EventEmitter {
  public check(translations: TranslationFile[], sources: File[]) {
    const keys = getAllKeys(translations);

    this.emit('checking', { keys, sources, translations });
    const unused = keys.filter(key => {
      const source = findUsage(key, sources);
      if (source) {
        this.emit('used', { key, source });
        return false;
      }

      this.emit('unused', { key, sources });
      return true;
    });

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
