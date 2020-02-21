# `compare` command

The `compare` command compares translation files with a reference file to find additional or missing keys and output differences.

## Usage

    $ bin/compare \
      --reference ../my-project/src/assets/i18n/en.json \
      --translations "../my-project/src/assets/i18n/??.json" \
      > ./compared.txt

### Arguments

#### `--help`

Print this file.

#### `--reference`

Path of the reference translation file (e.g.: `../my-project/src/assets/i18n/en.json`).

#### `--translations`

Glob of translation JSON files to compare. (e.g.: `"../my-project/src/assets/i18n/??.json"`)

> Important: Use quotes !

#### `<output>`

Differences of files with the reference file where lines are formatted as following:

- `@@@ <file_path>`
- `+++ <additional_key>`
- `--- <missing_key>`
