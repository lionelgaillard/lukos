# Translations cleaning

Utility commands to clean JSON translation files.

## `check` command

The `check` command checks if translations are used and put unused translation keys in a file.

> Note that will only search for keys as is, and it's not able to resolve dynamically created keys.

### Usage

    $ npm run check -- --translations ../my-project/src/assets/i18n/??.json --sources "../my-project/src/**/*.@(ts|html)"

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

    $ npm run clean -- --translations "../my-project/src/assets/i18n/??.json"

#### Options

##### `--keys`

Path of the file containing one key to remove per line. Usually the output of the `check` command. (default: `./unused.txt`)

##### `--translations`

Glob of translation JSON files where to remove unused items. (e.g.: `"../project/src/assets/i18n/??.json"`)

> Important: Use quotes !

## `compare` command

The `compare` command compare translation files with a reference file to find additional or missing keys and save differences in a file.

### Usage

    $ npm run compare -- --reference ../my-project/src/assets/i18n/en.json --translations "../my-project/src/assets/i18n/??.json"

#### Options

##### `--reference`

Path of the reference translation file (e.g.: `../my-project/src/assets/i18n/en.json`).

##### `--translations`

Glob of translation JSON files to compare. (e.g.: `"../project/src/assets/i18n/??.json"`)

> Important: Use quotes !

##### `--output`

Path of output file (default: `./compared.txt`).
