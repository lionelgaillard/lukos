import { EventEmitter } from 'events';
import { readJsonSync, writeFileSync } from 'fs-extra';
import { File, getFiles } from './files';

export const checking = new EventEmitter();

export function check(translationPath: string, sourceGlobs: string[], outputPath: string) {
  const sources = getFiles(sourceGlobs);
  const translation = getTranslation(translationPath);
  const keys = getKeys(translation);
  checking.emit('checking', { keys, sources });
  const unused = keys.filter(key => !isUsed(key, sources));
  checking.emit('checked', { unused, outputPath });
  saveOutput(outputPath, unused);
}

function getTranslation(path: string) {
  return readJsonSync(path);
}

function getKeys(source: any, prefix: string = '') {
  return Object.keys(source).reduce((keys, key) => {
    if (typeof source[key] === 'string') {
      keys.push(prefix + key);
    } else {
      keys = [...keys, ...getKeys(source[key], prefix + key + '.')];
    }
    return keys;
  }, []);
}

function isUsed(key: string, files: File[]) {
  return !!files.find(file => file.content.match(new RegExp(key)));
}

function saveOutput(path: string, keys: string[]) {
  writeFileSync(path, keys.join('\n'), 'utf-8');
}
