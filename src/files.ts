import { readFile } from 'fs-extra';
import glob from 'glob';

export interface File {
  path: string;
  content: string;
}

export function resolvePattern(pattern: string) {
  return new Promise<string[]>((resolve, reject) => glob(pattern, (error, matches) => (error ? reject(error) : resolve(matches))));
}

export async function loadFile(path: string): Promise<File> {
  return {
    path,
    content: await readFile(path, 'utf8'),
  };
}

export async function loadFiles(pattern: string): Promise<File[]> {
  const paths = await resolvePattern(pattern);
  return Promise.all(paths.map(path => loadFile(path)));
}
