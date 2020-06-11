# `check` command

The `translations-check` command checks if translations are used and output unused translation keys.

> Note that will it only search for keys **AS IS**, and it's not able to resolve dynamically created keys.

## Usage

    $ translations-check \
      --translations "src/assets/i18n/??.json" \
      --sources "src/**/*.@(ts|html)" \
      > ./unused.txt

### Arguments

#### `--help`

Print this file.

#### `--translations`

Glob of JSON files (e.g.: `"src/assets/i18n/??.json"`).

> Important: Use quotes !

#### `--sources`

Glob of files where to find translations (e.g.: `"src/**/*.@(ts|html)"`)

> Important: Use quotes !

#### `<output>`

Unused keys. One per line.
