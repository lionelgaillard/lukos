import { readJson, writeJson } from 'fs-extra';
import { resolvePattern } from './files';

export interface TranslationFile {
  path: string;
  data: any;
  keys: string[];
}

export interface ComparedTranslationFile extends TranslationFile {
  additions: string[];
  substractions: string[];
}

export async function saveTranslation(file: TranslationFile): Promise<void> {
  await writeJson(file.path, sortTranslation(file.data), { spaces: 2 });
}

export async function saveTranslations(files: TranslationFile[]): Promise<void> {
  await Promise.all(files.map(t => saveTranslation(t)));
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

export async function loadTranslation(path: string): Promise<TranslationFile> {
  const data = await readJson(path);
  const keys = getTranslationKeys(data);
  return {
    path,
    data,
    keys,
  };
}

export async function loadTranslations(pattern: string): Promise<TranslationFile[]> {
  const paths = await resolvePattern(pattern);
  return Promise.all(paths.map(path => loadTranslation(path)));
}

export function serializeComparedTranslation(files: ComparedTranslationFile[]): string {
  return files.reduce((output, file) => {
    output += `@@@ ${file.path}\n`;
    if (file.additions.length > 0) {
      output += file.additions.map(key => `+++ ${key}`).join('\n') + '\n';
    }
    if (file.substractions.length > 0) {
      output += file.substractions.map(key => `--- ${key}`).join('\n') + '\n';
    }
    return output;
  }, '');
}

export async function deserializeComparedTranslations(input: string): Promise<ComparedTranslationFile[]> {
  const parts = input
    .split('@@@ ')
    .map(c => c.trim())
    .filter(Boolean);

  const compared: ComparedTranslationFile[] = [];

  for (const part of parts) {
    const lines = part.split('\n');
    if (lines.length === 0) {
      continue;
    }

    const path = lines.shift();
    const file = await loadTranslation(path);
    const additions = lines.filter(line => line.startsWith('+++ ')).map(line => line.substr(4));
    const substractions = lines.filter(line => line.startsWith('--- ')).map(line => line.substr(4));
    compared.push({
      ...file,
      additions,
      substractions,
    });
  }

  return compared;
}

export function compareTranslation(reference: TranslationFile, file: TranslationFile): ComparedTranslationFile {
  return {
    ...file,
    additions: file.keys.filter(key => !reference.keys.includes(key)),
    substractions: reference.keys.filter(key => !file.keys.includes(key)),
  };
}

function getTranslationKeys(data: any, prefix: string = '') {
  return Object.keys(data).reduce((keys, key) => {
    if (typeof data[key] === 'string') {
      keys.push(prefix + key);
    } else {
      keys = [...keys, ...getTranslationKeys(data[key], prefix + key + '.')];
    }
    return keys;
  }, []);
}

export function addTranslationKey(data: any, key: string, value: string) {
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

export function deleteTranslationKey(data: any, key: string): boolean {
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

export function getTranslationValue(data: any, path: string) {
  return path.split('.').reduce((data, key) => (data && data[key]) || null, data);
}
