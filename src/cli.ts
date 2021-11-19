#!/usr/bin/env node

import { program } from 'commander';
import { readJsonSync } from 'fs-extra';
import { join } from 'path';
import { CheckCommand } from './check/check.command';
import { Checker } from './check/checker';
import { CompareCommand } from './compare/compare.command';
import { Comparer } from './compare/comparer';
import { CompleteCommand } from './complete/complete.command';
import { Completer } from './complete/completer';
import { ConfigCommand } from './config/config.command';
import { CopyCommand } from './copy/copy.command';
import { ExportCommand } from './export/export.command';
import { FormatCommand } from './format/format.command';
import { KeysCommand } from './keys/keys.command';
import { PickCommand } from './pick/pick.command';
import { CleanCommand } from './remove/remove.command';
import { Remover } from './remove/remover';
import { TranslateCommand } from './translate/translate.command';
import { createTranslator } from './translate/translator.factory';

program.version(readJsonSync(join(__dirname, '..', 'package.json')).version);

program
  .command('check <translations> <sources>')
  .description('Checks if translations are used and output unused translation keys.', {
    translations: 'Glob of the translation files (use quotes!)',
    sources: 'Glob of the files where to find translation keys (use quotes!)',
  })
  .addHelpText('after', "Note that will only search for keys **AS IS**, and it's not able to resolve dynamically created keys.")
  .action(async (translations: string, sources: string) => {
    const checker = new Checker()
      .on('checking', ({ keys, sources }) => console.error(`Checking ${keys.length} keys in ${sources.length} files...`))
      .on('checked', ({ unused }) => console.error(`Found ${unused.length} unused keys`))
      .on('used', ({ key, source }) => console.error(`${key} is used by ${source.path}`))
      .on('unused', ({ key }) => console.error(`${key} is unused`));
    const command = new CheckCommand(checker);
    await command.run(process.stdout, sources, translations);
  });

program
  .command('compare <reference> <translations>')
  .alias('diff')
  .description('Compare files with a reference file', {
    reference: 'Path to the reference file',
    translations: 'Glob of the translation files to compare (use quotes!)',
  })
  .action(async (reference: string, translations: string) => {
    const comparer = new Comparer()
      .on('comparing', ({ reference, translations }) => console.error(`Comparing ${reference.path} with ${translations.length} files...`))
      .on('diff', ({ file }) => console.error(`${file.path} +${file.additions.length} -${file.substractions.length}`));
    const command = new CompareCommand(comparer);
    await command.run(process.stdout, reference, translations);
  });

program
  .command('complete')
  .alias('patch')
  .description('Completes missing keys from a reference file')
  .action(async ({ args }) => {
    const completer = new Completer(createTranslator())
      .on('completing', ({ reference, translations }) =>
        console.error(`Completing ${translations.length} files with values of ${reference.path}...`)
      )
      .on('added', ({ file, key }) => console.error(`Added ${key} in ${file.path}`))
      .on('passed', ({ file, key }) => console.error(`Passed ${key} in ${file.path}`));
    const command = new CompleteCommand(completer);
    await command.run(process.stdin);
  });

program
  .command('copy <source> <target> <translations>')
  .alias('cp')
  .description('Finds key values in all translation files', {
    source: 'Old key',
    target: 'New key',
    translations: 'Glob of the translation files (use quotes!)',
  })
  .action(async (source, target, translations: string) => {
    const command = new CopyCommand();
    await command.run(source, target, translations);
  });

program
  .command('config <key> [value]')
  .description('Get or set a config value', {
    key: 'The config key to get or set',
    value: 'The config value to set',
  })
  .action(async (key: string, value: string) => {
    try {
      const command = new ConfigCommand();
      await command.run(process.stdout, key, value);
    } catch (error) {
      console.error(`Error: ${error.message} in ${error.fileName} at ${error.lineNumber}`, error.stack);
    }
  });

program
  .command('export <translations>')
  .description('Export key/values as CSV', {
    translations: 'Glob of the translation files (use quotes!)',
  })
  .action(async (translations: string) => {
    const command = new ExportCommand();
    await command.run(process.stdout, translations);
  });

program
  .command('format <translations>')
  .description('Sort keys and format of your JSON translation files', {
    translations: 'Glob of the translation files (use quotes!)',
  })
  .action(async (translations: string) => {
    const command = new FormatCommand();
    await command.run(translations);
  });

program
  .command('keys <translations>')
  .description('Print keys of all translation files', {
    translations: 'Glob of the translation files (use quotes!)',
  })
  .action(async (translations: string) => {
    const command = new KeysCommand();
    await command.run(process.stdout, translations);
  });

program
  .command('pick <translations>')
  .description('Finds key values in all translation files', {
    translations: 'Glob of the translation files (use quotes!)',
  })
  .action(async (translations: string) => {
    const command = new PickCommand();
    await command.run(process.stdin, process.stdout, translations);
  });

program
  .command('remove <translations>')
  .alias('rm')
  .alias('clean')
  .description('Removes unused items from translation files', {
    translations: 'Glob of the translation files (use quotes!)',
  })
  .addHelpText('after', 'Always double check your unused keys before running the command.')
  .action(async (translations: string) => {
    const remover = new Remover()
      .on('remove.pre', ({ keys, translations }) => console.error(`Removing ${keys.length} keys from ${translations.length} files...`))
      .on('removed', ({ key, file }) => console.error(`Removed "${key}" from "${file.path}".`))
      .on('passed', ({ key, file }) => console.error(`Passed "${key}" from "${file.path}".`));
    const command = new CleanCommand(remover);
    await command.run(process.stdin, translations);
  });

program
  .command('translate <source> <locale>')
  .description('Translate a source file into a new language', {
    source: 'Path to the source file',
    locale: 'Locale of the target language',
  })
  .action(async (source: string, locale: string) => {
    const command = new TranslateCommand(createTranslator());
    await command.run(source, locale);
  });

program.parseAsync();
