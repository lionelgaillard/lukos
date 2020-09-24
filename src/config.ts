import { ensureDirSync, existsSync, readJsonSync, writeJsonSync } from 'fs-extra';
import * as merge from 'lodash.merge';
import { join } from 'path';

interface Config {
  translate: {
    google: {
      projectId: string | null;
    };
  };
}

const HOME_DIR = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME;
const CONFIG_DIR = join(HOME_DIR, '.jsonl');
const CONFIG_PATH = join(CONFIG_DIR, 'config.json');
const DEFAULTS: Config = {
  translate: {
    google: {
      projectId: null,
    },
  },
};

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    return DEFAULTS;
  }

  return merge({}, DEFAULTS, readJsonSync(CONFIG_PATH)) as Config;
}

export function saveConfig() {
  ensureDirSync(CONFIG_DIR);
  writeJsonSync(CONFIG_PATH, config, { spaces: 2 });
}

export const config = loadConfig();
saveConfig();
