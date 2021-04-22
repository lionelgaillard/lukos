import test from 'ava';
import { ensureDirSync, rmdirSync, writeFileSync } from 'fs-extra';

/**
 * Use `%dir%` as placeholder for test directory.
 */
export function fixtures(files: { [name: string]: string }) {
  const dir = `_test_${Math.random().toString(36).substr(0, 8)}_`;

  test.before(() => {
    ensureDirSync(dir);
    for (const name in files) {
      const content = files[name].replace(/%dir%/g, dir);
      writeFileSync(`${dir}/${name}`, content, 'utf8');
    }
  });

  test.after(t => {
    rmdirSync(dir, { recursive: true });
  });

  return dir;
}
