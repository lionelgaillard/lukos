# `pick` command

The `translations-pick` command finds key values in all translation files.

## Usage

    $ echo 'nav.labels.about' | translations-pick --translations "src/assets/i18n/*.json"
    {
      "nav.labels.about": {
        "src/assets/i18n/cn.json": "关于",
        "src/assets/i18n/de.json": "Über",
        "src/assets/i18n/en.json": "About",
        "src/assets/i18n/es.json": "Acerca de",
        "src/assets/i18n/fr.json": "A propos",
        "src/assets/i18n/it.json": "Informazioni su",
        "src/assets/i18n/kz.json": "Туралы",
        "src/assets/i18n/ru.json": "Около",
        "src/assets/i18n/sk.json": "O",
        "src/assets/i18n/uk.json": "Про"
      }
    }

### Aguments

#### `<input>`

Keys to pick. One per line.

#### `--help`

Print this file.

#### `--translations`

Glob of translation JSON files where to find keys. (e.g.: `"src/assets/i18n/*.json"`)

> Important: Use quotes !
