import { TranslationServiceClient } from '@google-cloud/translate/build/src/v3';
import { Translator } from './translator';

export class GoogleTranslator implements Translator {
  private client: TranslationServiceClient;

  constructor(private readonly projectId: string) {
    this.client = new TranslationServiceClient();
  }

  public async translate(source: string, target: string, contents: string[]): Promise<string[]> {
    if (source === target) {
      return contents;
    }

    const request = {
      contents,
      sourceLanguageCode: source,
      targetLanguageCode: target,
      parent: `projects/${this.projectId}`,
      mimeType: 'text/plain',
    };

    const [response] = await this.client.translateText(request);
    return response.translations.map(t => t.translatedText);
  }
}
