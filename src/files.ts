import { readFileSync, writeFileSync } from 'fs-extra';
import * as glob from 'glob';

export interface File {
  path: string;
  content: string;
}

export function getFiles(globs: string[]): File[] {
  return globs
    .map(g => glob.sync(g))
    .flat(1)
    .map(path => ({
      path,
      content: readFileSync(path, 'utf-8'),
    }));
}

export function saveFile(file: File) {
  writeFileSync(file.path, file.content, 'utf-8');
}
