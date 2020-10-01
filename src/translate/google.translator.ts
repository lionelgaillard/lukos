import { TranslationServiceClient } from '@google-cloud/translate/build/src/v3';
import { readJson } from 'fs-extra';
import { Translator } from './translator';

export class GoogleTranslator implements Translator {
  private client: TranslationServiceClient;

  constructor(serviceAccount: string) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccount;
    this.client = new TranslationServiceClient();
  }

  public async translate(source: string, target: string, contents: string[]): Promise<string[]> {
    if (source === target) {
      return contents;
    }

    const credentials = await readJson(process.env.GOOGLE_APPLICATION_CREDENTIALS);

    const request = {
      contents,
      sourceLanguageCode: source,
      targetLanguageCode: target,
      parent: `projects/${credentials.project_id}`,
      mimeType: 'text/plain',
    };

    const [response] = await this.client.translateText(request);
    return response.translations.map(t => t.translatedText);
  }
}
