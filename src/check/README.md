# `check` command

The `check` command checks if translations are used and output unused translation keys.

> Note that will it only search for keys **AS IS**, and it's not able to resolve dynamically created keys.

## Usage

    $ bin/check \
      --translations "../my-project/src/assets/i18n/??.json" \
      --sources "../my-project/src/**/*.@(ts|html)" \
      > ./unused.txt

### Arguments

#### `--translations`

Glob of JSON files (e.g.: `"../my-project/src/assets/i18n/??.json"`).

> Important: Use quotes !

#### `--sources`

Glob of files where to find translations (e.g.: `"../my-project/src/**/*.@(ts|html)"`)

> Important: Use quotes !

#### `<output>`

Unused keys. One per line.
