import { config } from '../config';
import { GoogleTranslator } from './google.translator';
import { NoopTranslator } from './noop.translator';

export function createTranslator() {
  if (config.translate.google.projectId) {
    return new GoogleTranslator(config.translate.google.projectId);
  }

  return new NoopTranslator();
}
