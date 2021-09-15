import { extractValues, TranslationFile, TranslationValues } from '../translations';

const VALUE_SEPARATOR = ';';
const LINE_SEPARATOR = '\n';

export function toCsv(files: TranslationFile[]): string {
  const translations = extractValues(files);
  return makeHeaders(translations) + makeRows(translations);
}

function makeHeaders(translations: TranslationValues) {
  const first = Object.values(translations)[0];
  const locales = Object.keys(first).map(key => key.toUpperCase());
  return formatRow(['Key', ...locales]);
}

function makeRows(translations: TranslationValues): string {
  return Object.keys(translations).reduce((rows, key) => {
    const values = Object.values(translations[key]);
    return rows + formatRow([key, ...values]);
  }, '');
}

function formatRow(values: string[]) {
  return values.map(formatCell).join(VALUE_SEPARATOR) + LINE_SEPARATOR;
}

function formatCell(value: string) {
  return `"${value || ''}"`;
}
