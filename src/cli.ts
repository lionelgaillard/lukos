import { program } from '@caporal/core';
import { CheckCommand } from './check/check.command';
import { Checker } from './check/checker';
import { CleanCommand } from './clean/clean.command';
import { Cleaner } from './clean/cleaner';
import { CompareCommand } from './compare/compare.command';
import { Comparer } from './compare/comparer';
import { CompleteCommand } from './complete/complete.command';
import { Completer } from './complete/completer';
import { FormatCommand } from './format/format.command';
import { PickCommand } from './pick/pick.command';

program
  .command('check', 'Checks if translations are used and output unused translation keys.')
  .help("Note that will it only search for keys **AS IS**, and it's not able to resolve dynamically created keys.")
  .argument('<translations>', 'Glob of the translation files (use quotes!)')
  .argument('<sources>', 'Glob of the files where to find translation keys (use quotes!)')
  .action(async ({ logger, args }) => {
    const checker = new Checker()
      .on('checking', ({ keys, sources }) => logger.info(`Checking ${keys.length} keys in ${sources.length} files...`))
      .on('checked', ({ unused }) => logger.info(`Found ${unused.length} unused keys`))
      .on('used', ({ key, source }) => logger.info(`${key} is used by ${source.path}`))
      .on('unused', ({ key }) => logger.info(`${key} is unused`));
    const command = new CheckCommand(checker);
    await command.run(process.stdout, args.sources as string, args.translations as string);
  });

program
  .command('clean', 'Removes unused items from translation files')
  .help('Always double check your unused keys before running the command.')
  .argument('<translations>', 'Glob of the translation files (use quotes!)')
  .action(async ({ logger, args }) => {
    const cleaner = new Cleaner()
      .on('cleaning', ({ keys, translations }) => logger.info(`Removing ${keys.length} keys from ${translations.length} files...`))
      .on('removed', ({ key, file }) => logger.info(`Removed "${key}" from "${file.path}".`))
      .on('passed', ({ key, file }) => logger.info(`Passed "${key}" from "${file.path}".`));
    const command = new CleanCommand(cleaner);
    await command.run(process.stdin, args.translations as string);
  });

program
  .command('compare', 'Compare files with a reference file')
  .argument('<reference>', 'Path to the reference file')
  .argument('<translations>', 'Glob of the translation files to compare (use quotes!)')
  .action(async ({ logger, args }) => {
    const comparer = new Comparer()
      .on('comparing', ({ reference, translations }) => logger.info(`Comparing ${reference.path} with ${translations.length} files...`))
      .on('diff', ({ file }) => logger.info(`${file.path} +${file.additions.length} -${file.substractions.length}`));
    const command = new CompareCommand(comparer);
    await command.run(process.stdout, args.reference as string, args.translations as string);
  });

program
  .command('complete', 'Completes missing keys from a reference file')
  .argument('<reference>', 'Path of the reference translation file')
  .action(async ({ logger, args }) => {
    const completer = new Completer()
      .on('completing', ({ reference, translations }) =>
        logger.info(`Completing ${translations.length} files with values of ${reference.path}...`)
      )
      .on('added', ({ file, key }) => logger.info(`Added ${key} in ${file.path}`))
      .on('passed', ({ file, key }) => logger.info(`Passed ${key} in ${file.path}`));
    const command = new CompleteCommand(completer);
    await command.run(process.stdin, args.reference as string);
  });

program
  .command('format', 'Sort keys and format of your JSON translation files')
  .argument('<translations>', 'Glob of the translation files to compare (use quotes!)')
  .action(async ({ logger, args }) => {
    const command = new FormatCommand();
    await command.run(args.translations as string);
  });

program
  .command('pick', 'Finds key values in all translation files')
  .argument('<translations>', 'Glob of the translation files to compare (use quotes!)')
  .action(async ({ logger, args }) => {
    const command = new PickCommand();
    await command.run(process.stdin, process.stdout, args.translations as string);
  });

program.run();
