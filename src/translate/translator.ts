export interface Translator {
  translate(source: string, target: string, contents: string[]): Promise<string[]>;
}
