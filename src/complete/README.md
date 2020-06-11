# `complete` command

The `translations-complete` command completes missing keys from a reference file.

## Usage

    $ cat compared.txt | translations-complete --reference src/assets/i18n/en.json

### Arguments

#### `<input>`

Differences as outputted by the `translations-compare` command.

#### `--help`

Print this file.

#### `--reference`

Path of the reference translation file.
