import { readFileSync, writeFileSync } from 'fs-extra';
import * as glob from 'glob';

export interface File {
  path: string;
  content: string;
}

export function resolvePaths(pattern: string) {
  return glob.sync(pattern);
}

export function loadFile(path: string) {
  return {
    path,
    content: readFileSync(path, 'utf-8'),
  };
}

export function loadFiles(paths: string[]): File[] {
  return paths.map(path => loadFile(path));
}

export function saveFile(file: File) {
  writeFileSync(file.path, file.content, 'utf-8');
}
