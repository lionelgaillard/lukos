# `clean` command

The `clean` command removes unused items from translation files.

> Always double check your unused keys before running the command.

## Usage

    $ cat unused.txt | bin/clean --translations "../my-project/src/assets/i18n/??.json"

### Arguments

#### `<input>`

Keys to remove. One per line.

#### `--help`

Print this file.

#### `--translations`

Glob of translation JSON files where to remove unused keys. (e.g.: `"../my-project/src/assets/i18n/??.json"`)

> Important: Use quotes !
