# `check` command

Checks if translations are used and output unused translation keys (one key per line).

## Usage

    $ lukos check "assets/i18n/??.json" "src/**/*.(ts|html)" > unused.txt

## Arguments

### `<translations>`

Glob of the translation files to compare (use quotes!).

### `<sources>`

Glob of the files where to find translation keys (use quotes!).
