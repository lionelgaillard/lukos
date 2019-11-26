# Translations cleaning

Utility commands to clean JSON translation files:

- `check` to detect unused keys
- `clean` to delete unused keys
- `compare` to found differences between files
- `complete` to complete missing keys from a reference file

## `check` command

The `check` command checks if translations are used and put unused translation keys in a file.

> Note that will only search for keys as is, and it's not able to resolve dynamically created keys.

### Usage

    npm run check -- \
      --translations "../my-project/src/assets/i18n/??.json" \
      --sources "../my-project/src/**/*.@(ts|html)" \
      --output ./unused.txt

#### Options

##### `--translations`

Glob of JSON files (e.g.: `../my-project/src/assets/i18n/??.json`).

##### `--output`

Path of output file (default: `./unused.txt`).

##### `--sources`

Glob of files where to find translations (e.g.: `"../my-project/src/**/*.@(ts|html)"`)

> Important: Use quotes !

## `clean` command

The `clean` command removes unused items from translation files.

> Always double check content of the `unused.txt` file before running the command.

### Usage

    npm run clean -- \
      --translations "../my-project/src/assets/i18n/??.json" \
      --keys ./unused.txt

#### Options

##### `--keys`

Path of the file containing one key to remove per line. Usually the output of the `check` command. (default: `./unused.txt`)

##### `--translations`

Glob of translation JSON files where to remove unused items. (e.g.: `"../my-project/src/assets/i18n/??.json"`)

> Important: Use quotes !

## `compare` command

The `compare` command compare translation files with a reference file to find additional or missing keys and save differences in a file.

### Usage

    npm run compare -- \
      --reference ../my-project/src/assets/i18n/en.json \
      --translations "../my-project/src/assets/i18n/??.json" \
      --output ./compared.txt

#### Options

##### `--reference`

Path of the reference translation file (e.g.: `../my-project/src/assets/i18n/en.json`).

##### `--translations`

Glob of translation JSON files to compare. (e.g.: `"../my-project/src/assets/i18n/??.json"`)

> Important: Use quotes !

##### `--output`

Path of output file (default: `./compared.txt`).

## `complete` command

The `complete` command completes missing keys from a reference file.

### Usage

    npm run complete -- \
      --reference ../my-project/src/assets/i18n/en.json \
      --diff ./compared.txt

#### Options

##### `--reference`

Path of the reference translation file.

##### `--diff`

Path of the diff file. Usually the output of the `compare` command (default: `./compared.txt`).
