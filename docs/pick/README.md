# `pick` command

Finds key values in all translation files.

## Usage

    $ cat keys.txt | lukos pick "assets/i18n/??.json"

## Arguments

### `stdin`

A list of keys (one key per line).

### `<translations>`

Glob of the translation files from which extract values (use quotes!).
