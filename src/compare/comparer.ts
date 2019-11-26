import { EventEmitter } from 'events';
import { closeSync, openSync, writeSync } from 'fs-extra';
import { resolvePaths } from '../common/files';
import { loadTranslation, loadTranslations, TranslationFile } from '../common/translations';

export interface DiffedTranslationFile extends TranslationFile {
  additions: string[];
  substractions: string[];
}

export class Comparer extends EventEmitter {
  public compare(referencePath: string, translationsGlob: string, outputPath: string) {
    const reference = loadTranslation(referencePath);
    const translations = loadTranslations(resolvePaths(translationsGlob));

    this.emit('comparing', { reference, translations });
    const compared = translations.map(file => {
      const diffed = this.diff(reference, file);
      this.emit('diff', { file: diffed });
      return diffed;
    });
    this.emit('compared', { reference, translations: compared });
    this.save(outputPath, compared);
    return compared;
  }

  private diff(reference: TranslationFile, file: TranslationFile): DiffedTranslationFile {
    return {
      ...file,
      additions: file.keys.filter(key => !reference.keys.includes(key)),
      substractions: reference.keys.filter(key => !file.keys.includes(key)),
    };
  }

  private save(path: string, compared: DiffedTranslationFile[]) {
    const output = openSync(path, 'w');
    compared.forEach(file => {
      writeSync(output, `@@@ ${file.path}\n`);
      if (file.additions.length > 0) {
        writeSync(output, file.additions.map(key => `+++ ${key}`).join('\n') + '\n');
      }
      if (file.substractions.length > 0) {
        writeSync(output, file.substractions.map(key => `--- ${key}`).join('\n') + '\n');
      }
    });
    closeSync(output);
  }
}
