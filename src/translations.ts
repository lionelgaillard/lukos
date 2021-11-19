import { readJsonSync, writeJsonSync } from 'fs-extra';
import { sync } from 'glob';
import { basename } from 'path';
import { getKeys } from './objects';

export class TranslationFile {
  public static fromPath(path: string): TranslationFile {
    return new TranslationFile(path, readJsonSync(path));
  }

  public static fromGlob(glob: string): TranslationFile[] {
    const paths = sync(glob);
    return paths.map(path => TranslationFile.fromPath(path));
  }

  public static values(translations: TranslationFile[]): TranslationValues {
    const values = {};
    const keys = extractKeys(translations);

    for (let key of keys) {
      if (!values[key]) {
        values[key] = {};
      }

      for (let translation of translations) {
        values[key][translation.locale] = translation.get(key);
      }
    }

    return values;
  }

  constructor(public readonly path: string, public data: any) {}

  public get locale() {
    return basename(this.path).substr(0, 2);
  }

  private _keys: string[] = null;
  public get keys() {
    if (this._keys === null) {
      this._keys = getKeys(this.data);
    }
    return this._keys;
  }

  public has(key: string) {
    return this.keys.includes(key);
  }

  public get(key: string) {
    return key.split('.').reduce((data, key) => (data && data[key]) || null, this.data);
  }

  public add(key: string, value: string) {
    if (this._keys) {
      this._keys.push(key);
    }
    return addTranslationKey(this.data, key, value);
  }

  public delete(key: string) {
    if (this._keys) {
      this._keys = this._keys.filter(k => k !== key);
    }
    return deleteTranslationKey(this.data, key);
  }

  public save(): void {
    return writeJsonSync(this.path, sortTranslation(this.data), { spaces: 2 });
  }

  public compare(other: TranslationFile): ComparedTranslationFile {
    const compared = new ComparedTranslationFile(other.path, other.data);
    compared.reference = this;
    compared.additions = other.keys.filter(key => !this.keys.includes(key));
    compared.substractions = this.keys.filter(key => !other.keys.includes(key));
    return compared;
  }
}

export class ComparedTranslationFile extends TranslationFile {
  public reference: TranslationFile;
  public additions: string[] = [];
  public substractions: string[] = [];

  public static serialize(files: ComparedTranslationFile[]): string {
    if (files.length === 0) {
      return '';
    }

    let output = `### ${files[0].reference.path}\n`;

    for (const file of files) {
      output += `@@@ ${file.path}\n`;
      for (const key of file.additions) {
        output += `+++ ${key}\n`;
      }
      for (const key of file.substractions) {
        output += `--- ${key}\n`;
      }
    }

    return output;
  }

  public static deserialize(input: string): ComparedTranslationFile[] {
    const compared: ComparedTranslationFile[] = [];
    let reference: TranslationFile = null;
    let current: ComparedTranslationFile = null;

    for (const line of input.split('\n')) {
      const prefix = line.substr(0, 3);
      const value = line.substr(4);

      switch (prefix) {
        case '###':
          reference = TranslationFile.fromPath(value);
          break;
        case '@@@':
          const data = readJsonSync(value);
          current = new ComparedTranslationFile(value, data);
          current.reference = reference;
          compared.push(current);
          break;
        case '+++':
          current.additions.push(value);
          break;
        case '---':
          current.substractions.push(value);
          break;
      }
    }

    return compared;
  }
}

export type TranslationValues = { [key: string]: { [locale: string]: string | null } };

function addTranslationKey(data: any, key: string, value: string): boolean {
  if (!data) {
    return false;
  }

  if (!key.includes('.')) {
    if (!data[key]) {
      data[key] = value;
      return true;
    }
    return false;
  }

  const [firstkey, ...otherKeys] = key.split('.');

  if (!data[firstkey]) {
    data[firstkey] = {};
  }

  return addTranslationKey(data[firstkey], otherKeys.join('.'), value);
}

function deleteTranslationKey(data: any, key: string): boolean {
  if (!data) {
    return false;
  }

  if (!key.includes('.')) {
    if (data[key]) {
      delete data[key];
      return true;
    }
    return false;
  }

  const [firstkey, ...otherKeys] = key.split('.');
  return deleteTranslationKey(data[firstkey], otherKeys.join('.'));
}

function sortTranslation(data: any): any {
  return Object.keys(data)
    .sort()
    .reduce((sorted, key) => {
      if (typeof data[key] === 'string') {
        sorted[key] = data[key];
      } else {
        sorted[key] = sortTranslation(data[key]);
      }
      return sorted;
    }, {});
}

function extractKeys(translations: TranslationFile[]): string[] {
  const keys = new Set<string>();

  for (let translation of translations) {
    for (let key of translation.keys) {
      keys.add(key);
    }
  }

  return Array.from(keys.values());
}
