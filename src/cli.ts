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
  .action(async ({ args }) => {
    const checker = new Checker()
      .on('checking', ({ keys, sources }) => console.error(`Checking ${keys.length} keys in ${sources.length} files...`))
      .on('checked', ({ unused }) => console.error(`Found ${unused.length} unused keys`))
      .on('used', ({ key, source }) => console.error(`${key} is used by ${source.path}`))
      .on('unused', ({ key }) => console.error(`${key} is unused`));
    const command = new CheckCommand(checker);
    await command.run(process.stdout, args.sources as string, args.translations as string);
  });

program
  .command('clean', 'Removes unused items from translation files')
  .help('Always double check your unused keys before running the command.')
  .argument('<translations>', 'Glob of the translation files (use quotes!)')
  .action(async ({ args }) => {
    const cleaner = new Cleaner()
      .on('cleaning', ({ keys, translations }) => console.error(`Removing ${keys.length} keys from ${translations.length} files...`))
      .on('removed', ({ key, file }) => console.error(`Removed "${key}" from "${file.path}".`))
      .on('passed', ({ key, file }) => console.error(`Passed "${key}" from "${file.path}".`));
    const command = new CleanCommand(cleaner);
    await command.run(process.stdin, args.translations as string);
  });

program
  .command('compare', 'Compare files with a reference file')
  .argument('<reference>', 'Path to the reference file')
  .argument('<translations>', 'Glob of the translation files to compare (use quotes!)')
  .action(async ({ args }) => {
    const comparer = new Comparer()
      .on('comparing', ({ reference, translations }) => console.error(`Comparing ${reference.path} with ${translations.length} files...`))
      .on('diff', ({ file }) => console.error(`${file.path} +${file.additions.length} -${file.substractions.length}`));
    const command = new CompareCommand(comparer);
    await command.run(process.stdout, args.reference as string, args.translations as string);
  });

program.command('complete', 'Completes missing keys from a reference file').action(async ({ args }) => {
  const completer = new Completer()
    .on('completing', ({ reference, translations }) =>
      console.error(`Completing ${translations.length} files with values of ${reference.path}...`)
    )
    .on('added', ({ file, key }) => console.error(`Added ${key} in ${file.path}`))
    .on('passed', ({ file, key }) => console.error(`Passed ${key} in ${file.path}`));
  const command = new CompleteCommand(completer);
  await command.run(process.stdin);
});

program
  .command('format', 'Sort keys and format of your JSON translation files')
  .argument('<translations>', 'Glob of the translation files to compare (use quotes!)')
  .action(async ({ args }) => {
    const command = new FormatCommand();
    await command.run(args.translations as string);
  });

program
  .command('pick', 'Finds key values in all translation files')
  .argument('<translations>', 'Glob of the translation files to compare (use quotes!)')
  .action(async ({ args }) => {
    const command = new PickCommand();
    await command.run(process.stdin, process.stdout, args.translations as string);
  });

program.run();
