import { Translator } from './translator';

export class NoopTranslator implements Translator {
  public translate(source: string, target: string, contents: string[]): Promise<string[]> {
    return Promise.resolve(contents);
  }
}
