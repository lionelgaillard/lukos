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
    header: true,
    columns: ['key', ...locales],
  });
}

export function fromCsv(input: string): TranslationValues {
  const data = parse(input, { delimiter: ',', columns: true }) as any[];

  return data.reduce((values, row) => {
    // const key = row['key'];
    const key = Object.values(row)[0] as string;

    if (!key) {
      throw new Error('CSV row is missing "key" column');
    }

    const locales = Object.keys(row).filter(x => x.length === 2);

    if (!values[key]) {
      values[key] = {};
    }

    for (const locale of locales) {
      values[key][locale] = row[locale];
    }

    return values;
  }, {});
}
