import { EventEmitter } from 'events';
import { Translator } from '../translate/translator';
import { ComparedTranslationFile } from '../translations';

export class Completer extends EventEmitter {
  constructor(private translator: Translator) {
    super();
  }

  public async complete(translations: ComparedTranslationFile[]) {
    if (translations.length === 0) {
      return translations;
    }

    this.emit('completing', { reference: translations[0].reference, translations });

    for (const file of translations) {
      if (file.reference.path === file.path) {
        continue;
      }

      const originals = file.substractions.map(key => file.reference.get(key));
      const translations = await this.translator.translate(file.reference.locale, file.locale, originals);
      for (const i in file.substractions) {
        const key = file.substractions[i];
        const original = originals[i];
        const translated = translations[i];
        if (file.add(key, translated)) {
          this.emit('added', { file, key, original, translated });
        } else {
          this.emit('passed', { file, key, original, translated });
        }
      }
    }

    translations.map(file => file.save());

    this.emit('completed', { reference: translations[0].reference, translations });

    return translations;
  }
}
