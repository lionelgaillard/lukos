import { config } from '../config';
import { GoogleTranslator } from './google.translator';
import { NoopTranslator } from './noop.translator';

export function createTranslator() {
  const serviceAccount = config.get<string>('translate.google.serviceAccount');
  if (serviceAccount) {
    return new GoogleTranslator(serviceAccount);
  }

  return new NoopTranslator();
}
