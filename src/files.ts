import { readFileSync } from 'fs-extra';
import { sync } from 'glob';

export class File {
  public static fromPath(path: string): File {
    const content = readFileSync(path, 'utf8');
    return new File(path, content);
  }

  public static fromGlob(glob: string) {
    const paths = sync(glob);
    return paths.map(File.fromPath);
  }

  constructor(public readonly path: string, public content: string) {}
}
