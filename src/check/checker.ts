import { EventEmitter } from 'events';
import { writeFileSync } from 'fs-extra';
import { File, loadFiles, resolvePaths } from '../common/files';
import { loadTranslations } from '../common/translations';

export class Checker extends EventEmitter {
  public check(translationsGlob: string, sourcesGlob: string, outputPath: string) {
    const sources = this.getSources(sourcesGlob);
    const keys = this.getKeys(translationsGlob);
    this.emit('checking', { keys, sources });
    const unused = keys.filter(key => {
      const source = this.findUsage(key, sources);
      if (source) {
        this.emit('used', { key, source });
        return false;
      }

      this.emit('unused', { key, sources });
      return true;
    });
    this.save(outputPath, unused);
    this.emit('checked', { unused });
    return unused;
  }

  private getSources(sourcesGlob: string) {
    return loadFiles(resolvePaths(sourcesGlob));
  }

  private getKeys(translationsGlob: string) {
    const translations = loadTranslations(resolvePaths(translationsGlob));
    return [...new Set(translations.map(t => t.keys).flat(1))];
  }

  private findUsage(key: string, sources: File[]) {
    return sources.find(file => file.content.match(new RegExp(key)));
  }

  private save(path: string, unused: string[]) {
    writeFileSync(path, unused.join('\n'), 'utf-8');
  }
}
