import test from 'ava';
import { ensureDirSync, rmdirSync, writeFileSync } from 'fs-extra';

export function fixtures(files: { [name: string]: string }): string {
  const dir = fixtures.dir;
  fixtures.dir = nextDir();

  test.before(() => {
    ensureDirSync(dir);
    for (const name in files) {
      const content = files[name];
      writeFileSync(`${dir}/${name}`, content, 'utf8');
    }
  });

  test.after(t => {
    rmdirSync(dir, { recursive: true });
  });

  return dir;
}

fixtures.dir = nextDir();

function nextDir(): string {
  return `_test_${Math.random().toString(36).substr(2, 8)}_`;
}
