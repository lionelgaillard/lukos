import { EventEmitter } from 'events';
import { readFileSync } from 'fs-extra';
import { getFiles, saveFile } from './files';

export const cleaning = new EventEmitter();

export function clean(keysPath: string, translationGlobs: string[]) {
  const keys = getKeys(keysPath);
  const translations = getFiles(translationGlobs);

  cleaning.emit('cleaning', { keys, translations });
  for (let file of translations) {
    const data = JSON.parse(file.content);
    for (let key of keys) {
      if (deleteKey(data, key)) {
        cleaning.emit('removed', { key, file });
      } else {
        cleaning.emit('passed', { key, file });
      }
    }
    file.content = JSON.stringify(data, null, 2);
    saveFile(file);
  }
  cleaning.emit('cleaned', { keys, translations });
}

function getKeys(path: string) {
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map(k => k.trim())
    .filter(Boolean);
}

function deleteKey(data: any, key: string): boolean {
  if (!key.includes('.')) {
    if (data[key]) {
      delete data[key];
      return true;
    }
    return false;
  }

  const [firstkey, ...otherKeys] = key.split('.');
  return deleteKey(data[firstkey], otherKeys.join('.'));
}
