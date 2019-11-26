import { readFileSync, writeFileSync } from 'fs-extra';
import * as glob from 'glob';

export interface File {
  path: string;
  content: string;
}

export function resolvePattern(pattern: string) {
  return glob.sync(pattern);
}

export function loadFile(path: string) {
  return {
    path,
    content: readFileSync(path, 'utf8'),
  };
}

export function loadFiles(pattern: string): File[] {
  return resolvePattern(pattern).map(path => loadFile(path));
}

export function saveFile(file: File) {
  writeFileSync(file.path, file.content, 'utf8');
}
