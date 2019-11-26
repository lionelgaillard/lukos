import { EventEmitter } from 'events';
import { File, loadFiles } from '../common/files';
import { saveKeys } from '../common/keys';
import { loadTranslations, TranslationFile } from '../common/translations';

export class Checker extends EventEmitter {
  public check(translationsGlob: string, sourcesGlob: string, outputPath: string) {
    const sources = loadFiles(sourcesGlob);
    const translations = loadTranslations(translationsGlob);
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
    saveKeys(outputPath, unused);
    this.emit('checked', { unused, outputPath });

    return unused;
  }
}

function getAllKeys(translations: TranslationFile[]) {
  return [...new Set(translations.map(t => t.keys).flat(1))];
}

function findUsage(key: string, sources: File[]) {
  return sources.find(file => file.content.match(new RegExp(key)));
}
