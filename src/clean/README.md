# `clean` command

The `translations-clean` command removes unused items from translation files.

> Always double check your unused keys before running the command.

## Usage

    $ cat unused.txt | translations-clean --translations "src/assets/i18n/??.json"

### Arguments

#### `<input>`

Keys to remove. One per line.

#### `--help`

Print this file.

#### `--translations`

Glob of translation JSON files where to remove unused keys. (e.g.: `"src/assets/i18n/??.json"`)

> Important: Use quotes !
