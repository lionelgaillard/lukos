import { join } from 'path';
import { Config } from './config';

const HOME_DIR = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME;
const PATH = join(HOME_DIR, '.lukos', 'config.json');

interface Data {
  translate: {
    google: {
      serviceAccount: string | null;
    };
  };
}

const DEFAULTS: Data = {
  translate: {
    google: {
      serviceAccount: null,
    },
  },
};

export const config = new Config<Data>(PATH, DEFAULTS);
