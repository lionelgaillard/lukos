import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { TranslationValues } from './translations';

export function toCsv(values: TranslationValues): string {
  const keys = Object.keys(values);
  const first = values[keys[0]];
  const locales = Object.keys(first);
  const data = keys.map(key => ({ key, ...values[key] }));

  return stringify(data, {
    delimiter: ',',
    columns: ['Key', ...locales],
  });
}

export function fromCsv(input: string): TranslationValues {
  const data = parse(input, { delimiter: ',', columns: true }) as any[];

  return data.reduce((values, row) => {
    const key = row['Key'];
    const locales = Object.keys(row).filter(p => p.length === 2);

    if (!values[key]) {
      values[key] = {};
    }

    for (const locale of locales) {
      values[key][locale] = row[locale];
    }

    return values;
  }, {});
}
