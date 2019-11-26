import { readFileSync, writeFileSync } from 'fs-extra';

export function saveKeys(path: string, keys: string[]) {
  writeFileSync(path, keys.join('\n'), 'utf8');
}

export function loadKeys(path: string) {
  return readFileSync(path, 'utf8')
    .split('\n')
    .map(k => k.trim())
    .filter(Boolean);
}
