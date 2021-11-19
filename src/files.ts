import { readFileSync } from 'fs-extra';
import { sync } from 'glob';

export class File {
  public static fromPath(path: string): File {
    return new File(path, readFileSync(path, 'utf8'));
  }

  public static fromGlob(glob: string) {
    return sync(glob).map(File.fromPath);
  }

  constructor(public readonly path: string, public content: string) {}
}
