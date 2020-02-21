# `pick` command

The `pick` command finds key values in all translation files.

## Usage

    $ echo 'nav.labels.about' | bin/pick --translations "../my-project/src/assets/i18n/*.json"
    {
      "nav.labels.about": {
        "../my-project/src/assets/i18n/cn.json": "关于",
        "../my-project/src/assets/i18n/de.json": "Über",
        "../my-project/src/assets/i18n/en.json": "About",
        "../my-project/src/assets/i18n/es.json": "Acerca de",
        "../my-project/src/assets/i18n/fr.json": "A propos",
        "../my-project/src/assets/i18n/it.json": "Informazioni su",
        "../my-project/src/assets/i18n/kz.json": "Туралы",
        "../my-project/src/assets/i18n/ru.json": "Около",
        "../my-project/src/assets/i18n/sk.json": "O",
        "../my-project/src/assets/i18n/uk.json": "Про"
      }
    }

### Aguments

#### `<input>`

Keys to pick. One per line.

#### `--help`

Print this file.

#### `--translations`

Glob of translation JSON files where to find keys. (e.g.: `"../my-project/src/assets/i18n/*.json"`)

> Important: Use quotes !
