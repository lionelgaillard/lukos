import { Writable } from 'stream';
import { config } from '.';
import { write } from '../stream';

export class ConfigCommand {
  public async run(output: Writable, key: string, value?: any) {
    if (value) {
      config.set(key, value);
      config.save();
      return;
    }

    value = config.get(key);

    if (!value || typeof value === 'object') {
      return;
    }

    await write(output, `${value}\n`);
  }
}
