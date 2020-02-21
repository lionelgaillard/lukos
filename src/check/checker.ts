import { EventEmitter } from 'events';
import { File } from '../common/files';
import { tick } from '../common/standard';
import { TranslationFile } from '../common/translations';

export class Checker extends EventEmitter {
  public async check(translations: TranslationFile[], sources: File[]) {
    const unused: string[] = [];
    const keys = getAllKeys(translations);

    this.emit('checking', { keys, sources, translations });
    await tick();

    for (const key of keys) {
      const source = findUsage(key, sources);
      if (source) {
        this.emit('used', { key, source });
        await tick();
      } else {
        unused.push(key);
        this.emit('unused', { key, sources });
        await tick();
      }
    }

    this.emit('checked', { unused });
    await tick();

    return unused;
  }
}

function getAllKeys(translations: TranslationFile[]) {
  return [...new Set(translations.map(t => t.keys).flat(1))];
}

function findUsage(key: string, sources: File[]) {
  return sources.find(file => file.content.match(new RegExp(key)));
}
