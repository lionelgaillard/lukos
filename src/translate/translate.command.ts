import { dirname, join } from 'path';
import { loadTranslation, TranslationFile } from '../translations';
import { NoopTranslator } from './noop.translator';
import { Translator } from './translator';

export class TranslateCommand {
  constructor(public translator: Translator) {}

  public async run(sourcePath: string, targetLocale: string) {
    if (this.translator instanceof NoopTranslator) {
      throw new Error(`The translate command requires a configured translation API.`);
    }

    const source = await loadTranslation(sourcePath);

    if (source.locale === targetLocale) {
      throw new Error('The source and target locales are the same.');
    }

    const keys = source.keys;
    const originals = keys.map(key => source.get(key));
    const translations = await this.translator.translate(source.locale, targetLocale, originals);
    const targetPath = join(dirname(sourcePath), `${targetLocale}.json`);
    const targetFile = new TranslationFile(targetPath, {});
    for (const i in keys) {
      const key = keys[i];
      const value = translations[i];
      targetFile.add(key, value);
    }
    targetFile.save();
  }
}
