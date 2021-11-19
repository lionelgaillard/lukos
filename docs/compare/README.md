# `compare` / `diff` command

Compare files with a reference file.

## Usage

    $ lukos diff assets/i18n/en.json "assets/i18n/??.json" > diff.txt

## Arguments

### `<reference>`

Path to the reference translation file.

### `<translations>`

Glob of the translation files to compare (use quotes!).
