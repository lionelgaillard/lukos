# Translations cleaning

Utility commands to clean JSON translation files:

- `check` to detect unused keys
- `clean` to delete unused keys
- `compare` to found differences between files
- `complete` to complete missing keys from a reference file

## `check` command

The `check` command checks if translations are used and output unused translation keys.

> Note that will only search for keys as is, and it's not able to resolve dynamically created keys.

### Usage

    check \
      --translations "../my-project/src/assets/i18n/??.json" \
      --sources "../my-project/src/**/*.@(ts|html)" \
      > ./unused.txt

#### Options

##### `--translations`

Glob of JSON files (e.g.: `../my-project/src/assets/i18n/??.json`).

##### `--sources`

Glob of files where to find translations (e.g.: `"../my-project/src/**/*.@(ts|html)"`)

## `clean` command

The `clean` command removes unused items from translation files.

> Always double check your unused keys before running the command.

### Usage

    cat unused.txt > clean --translations "../my-project/src/assets/i18n/??.json"

#### Options

##### `--translations`

Glob of translation JSON files where to remove unused items. (e.g.: `"../my-project/src/assets/i18n/??.json"`)

## `compare` command

The `compare` command compare translation files with a reference file to find additional or missing keys and output differences.

### Usage

    compare \
      --reference ../my-project/src/assets/i18n/en.json \
      --translations "../my-project/src/assets/i18n/??.json" \
      > ./compared.txt

#### Options

##### `--reference`

Path of the reference translation file (e.g.: `../my-project/src/assets/i18n/en.json`).

##### `--translations`

Glob of translation JSON files to compare. (e.g.: `"../my-project/src/assets/i18n/??.json"`)

## `complete` command

The `complete` command completes missing keys from a reference file.

### Usage

    cat compared.txt > complete \
      --reference ../my-project/src/assets/i18n/en.json \

#### Options

##### `--reference`

Path of the reference translation file.

##### `--diff`

Path of the diff file. Usually the output of the `compare` command (default: `./compared.txt`).
