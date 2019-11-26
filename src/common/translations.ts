import { readJsonSync, writeFileSync } from 'fs-extra';

export interface TranslationFile {
  path: string;
  data: any;
  keys: string[];
}

export function loadTranslation(path: string): TranslationFile {
  const data = readJsonSync(path);
  const keys = getTranslationKeys(data);
  return {
    path,
    data,
    keys,
  };
}

export function loadTranslations(paths: string[]): TranslationFile[] {
  return paths.map(path => loadTranslation(path));
}

export function saveTranslation(file: TranslationFile) {
  writeFileSync(file.path, JSON.stringify(file.data, null, 2), 'utf-8');
}

export function getTranslationKeys(data: any, prefix: string = '') {
  return Object.keys(data).reduce((keys, key) => {
    if (typeof data[key] === 'string') {
      keys.push(prefix + key);
    } else {
      keys = [...keys, ...getTranslationKeys(data[key], prefix + key + '.')];
    }
    return keys;
  }, []);
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
