import merge from 'deepmerge';
import { existsSync, outputJsonSync, readJsonSync } from 'fs-extra';
import { getKeys } from '../objects';

export class Config<T> {
  private data: T;

  constructor(private readonly path: string, private readonly defaults: T) {
    this.load();
    this.save();
  }

  public get<T>(key: string): T {
    if (!this.hasKey(key)) {
      throw new Error(`Key "${key}" doesn't exist`);
    }

    return key.split('.').reduce((data, key) => data && data[key], this.data);
  }

  public set(key: string, value: any) {
    if (!this.hasKey(key)) {
      throw new Error(`Key "${key}" doesn't exist`);
    }

    const keys = key.split('.');
    const last = keys.pop();
    const next = {};
    const parent = keys.reduce((data, key) => data[key] || (data[key] = {}), next);
    parent[last] = value;
    this.data = merge(this.data, next) as T;
  }

  public keys() {
    return getKeys(this.data);
  }

  public has(key: string) {
    return !!this.get(key);
  }

  public hasKey(key: string) {
    return this.keys().includes(key);
  }

  public save() {
    outputJsonSync(this.path, this.data, { spaces: 2 });
  }

  private load() {
    if (!existsSync(this.path)) {
      this.data = this.defaults;
      return;
    }

    this.data = merge(this.defaults, readJsonSync(this.path)) as T;
  }
}
