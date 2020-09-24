# lukos

Utility commands to clean JSON translation files.

## Usage

    $ lukos <command> [ARGUMENTS...] [OPTIONS...]

## Commands

You can get some help about a command by typing:

    $ lukos help <command>

or

    $ lukos <command> --help

### `check`

Checks if translations are used and output unused translation keys.

#### Arguments

##### `<translations>`

Glob of the translation files to compare (use quotes!)

##### `<sources>`

Glob of the files where to find translation keys (use quotes!)

### `clean`

Removes unused items from translation files

#### Arguments

##### `<translations>`

Glob of the translation files to compare (use quotes!)

### `compare`

Compare files with a reference file

#### Arguments

##### `<reference>`

Path to the reference file

##### `<translations>`

Glob of the translation files to compare (use quotes!)

### `complete`

Completes missing keys from a reference file

### `format`

Sort keys and format of your JSON translation files

#### Arguments

##### `<translations>`

Glob of the translation files to compare (use quotes!)

### `pick`

Finds key values in all translation files

#### Arguments

##### `<translations>`

Glob of the translation files to compare (use quotes!)
