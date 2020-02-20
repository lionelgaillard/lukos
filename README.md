# Translations cleaning

Utility commands to clean JSON translation files:

- `check` to detect unused keys
- `clean` to delete unused keys
- `compare` to found differences between files
- `complete` to complete missing keys from a reference file
- `pick` to find key values in all files

## `check` command

The `check` command checks if translations are used and output unused translation keys.

> Note that will only search for keys as is, and it's not able to resolve dynamically created keys.

### Usage

    $ bin/check \
      --translations "../my-project/src/assets/i18n/??.json" \
      --sources "../my-project/src/**/*.@(ts|html)" \
      > ./unused.txt

#### Options

##### `--translations`

Glob of JSON files (e.g.: `"../my-project/src/assets/i18n/??.json"`).

> Important: Use quotes !

##### `--sources`

Glob of files where to find translations (e.g.: `"../my-project/src/**/*.@(ts|html)"`)

> Important: Use quotes !

## `clean` command

The `clean` command removes unused items from translation files.

> Always double check your unused keys before running the command.

### Usage

    $ cat unused.txt | bin/clean --translations "../my-project/src/assets/i18n/??.json"

#### Options

##### `--translations`

Glob of translation JSON files where to remove unused items. (e.g.: `"../my-project/src/assets/i18n/??.json"`)

> Important: Use quotes !

## `compare` command

The `compare` command compare translation files with a reference file to find additional or missing keys and output differences.

### Usage

    $ bin/compare \
      --reference ../my-project/src/assets/i18n/en.json \
      --translations "../my-project/src/assets/i18n/??.json" \
      > ./compared.txt

#### Options

##### `--reference`

Path of the reference translation file (e.g.: `../my-project/src/assets/i18n/en.json`).

##### `--translations`

Glob of translation JSON files to compare. (e.g.: `"../my-project/src/assets/i18n/??.json"`)

> Important: Use quotes !

## `complete` command

The `complete` command completes missing keys from a reference file.

### Usage

    $ cat compared.txt | bin/complete --reference ../my-project/src/assets/i18n/en.json

#### Options

##### `--reference`

Path of the reference translation file.

##### `--diff`

Path of the diff file. Usually the output of the `compare` command (default: `./compared.txt`).

## `pick` command

The `pick` command find key values in all translation files.

### Usage

    $ echo 'nav.labels.about' | bin/pick --translations "../my-project/src/assets/i18n/*.json"
    {
      "nav.labels.about": {
        "../my-project/src/assets/i18n/cn.json": "关于",
        "../my-project/src/assets/i18n/de.json": "Über",
        "../my-project/src/assets/i18n/en.json": "About",
        "../my-project/src/assets/i18n/es.json": "Acerca de",
        "../my-project/src/assets/i18n/fr.json": "A propos",
        "../my-project/src/assets/i18n/it.json": "Informazioni su",
        "../my-project/src/assets/i18n/kz.json": "Туралы",
        "../my-project/src/assets/i18n/ru.json": "Около",
        "../my-project/src/assets/i18n/sk.json": "O",
        "../my-project/src/assets/i18n/uk.json": "Про"
      }
    }

#### Options

##### `--translations`

Glob of translation JSON files where to find keys. (e.g.: `"../my-project/src/assets/i18n/??.json"`)

> Important: Use quotes !
