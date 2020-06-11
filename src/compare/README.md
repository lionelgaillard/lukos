# `compare` command

The `translations-compare` command compares translation files with a reference file to find additional or missing keys and output differences.

## Usage

    $ translations-compare \
      --reference src/assets/i18n/en.json \
      --translations "src/assets/i18n/??.json" \
      > ./compared.txt

### Arguments

#### `--help`

Print this file.

#### `--reference`

Path of the reference translation file (e.g.: `src/assets/i18n/en.json`).

#### `--translations`

Glob of translation JSON files to compare. (e.g.: `"src/assets/i18n/??.json"`)

> Important: Use quotes !

#### `<output>`

Differences of files with the reference file where lines are formatted as following:

- `@@@ <file_path>`
- `+++ <additional_key>`
- `--- <missing_key>`
