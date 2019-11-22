# Translations cleaning

## check

The `check` command checks if translations are used and put unused translation keys in a file.

> Note that will only search for keys as is, and it's not able to resolve dynamically created keys.

### Usage

    $ npm run check -- [options] <sources>

#### Options

##### `--translation`

Path of the translation JSON file (e.g.: `../project/src/assets/i18n/en.json`).

##### `--output`

Path of output file (default: `./unused.txt`).

##### `<sources>`

Files where to find translations (e.g.: `"../project/src/**/*.ts" "../project/src/**/*.html"`)

> Important: Use quotes !

#### Example

    $ npm run check -- --translation ../my-project/src/assets/i18n/en.json "../my-project/src/**/*.ts" "../my-project/src/**/*.html"

## Clean

The `clean` command removes unused items from translation files.

> Always double check content of the `unused.txt` file before running the command.

### Usage

    $ npm run clean -- [options] <translations>

#### Options

##### `--keys`

Path of the file containing one key to remove per line. Usually the output of the `check` command. (default: `./unused.txt`)

##### `<translations>`

Translation JSON files where to remove unused items. (e.g.: `"../project/src/assets/i18n/*.json"`)

> Important: Use quotes !

#### Example

    $ npm run clean -- "../my-project/src/assets/i18n/*.json"

### Improvements

#### Clean empty groups

If an unused key was alone in its parent group, it will be removed and the parent group will stay empty.

##### Example

###### Before

    {
      "aGroup": {
        "anUnusedKey": "Lorem ipsum"
      }
    }

###### After

    {
      "aGroup": {}
    }
