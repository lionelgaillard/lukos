# lukos

A command line utility program to manage translation files.

## Installation

    $ npm i -g lukos

## Configuration

### Translation API

Optional.

To enable automatic translation you need:

- A Google Cloud project with the [Cloud Translation API](https://console.cloud.google.com/apis/library/translate.googleapis.com) activated.
- A service account with the role `roles/cloudtranslate.user` (Cloud Translation > User).
- To provide it to lukos by running:

      $ lukos config translate.google.serviceAccount <path-to-your-service-account-keys-as-json>

> Please, feel free to propose or implement alternative APIs.

## Commands

- [`help`](#help)
- [`check`](#check)
- [`clean`](#clean)
- [`compare`](#compare)
- [`complete`](#complete)
- [`config`](#config)
- [`format`](#format)
- [`pick`](#pick)
- [`translate`](#translate)

---

### `help`

You can get some help by typing:

    $ lukos --help

or

    $ lukos help command

or

    $ lukos <command> --help

---

### `check`

Checks if translations are used and output unused translation keys (one key per line).

#### Usage

    $ lukos check "assets/i18n/??.json" "src/**/*.(ts|html)" > unused.txt

#### Arguments

##### `<translations>`

Glob of the translation files to compare (use quotes!).

##### `<sources>`

Glob of the files where to find translation keys (use quotes!).

---

### `clean`

Removes unused items from translation files.

#### Usage

    $ cat unused.txt | lukos clean "assets/i18n/??.json"

#### Arguments

##### `stdin`

A list of unused keys as generated by the `check` command (one key per line).

##### `<translations>`

Glob of the translation files to clean (use quotes!).

---

### `compare`

Compare files with a reference file.

#### Usage

    $ lukos compare assets/i18n/en.json "assets/i18n/??.json" > diff.txt

#### Arguments

##### `<reference>`

Path to the reference translation file.

##### `<translations>`

Glob of the translation files to compare (use quotes!).

---

### `complete`

Completes missing keys from a reference file.

> To automatically translate values, you need to [configure the translation API](#translation-api).

#### Usage

    $ cat diff.txt | lukos complete

#### Arguments

##### `stdin`

A diff file as generated by the `compare` command.

---

### `config`

Get or set a config value.

#### Usage

    $ lukos config <key>

or

    $ lukos config <key> <value>

#### Arguments

##### `<key>`

The config key to get or set.

##### `[value]`

The config value to set.

---

### `format`

Sort keys and format of your JSON translation files.

#### Usage

    $ lukos format "assets/i18n/??.json"

#### Arguments

##### `<translations>`

Glob of the translation files to format (use quotes!).

---

### `pick`

Finds key values in all translation files.

#### Usage

    $ cat keys.txt | lukos pick "assets/i18n/??.json"

#### Arguments

##### `stdin`

A list of keys (one key per line).

##### `<translations>`

Glob of the translation files from which extract values (use quotes!).

---

### `translate`

Translate a source file into a new language.

#### Usage

    $ lukos translate assets/i18n/en.json fr

#### Arguments

##### `<source>`

Path to the source file.

##### `<locale>`

Locale of the target language.
