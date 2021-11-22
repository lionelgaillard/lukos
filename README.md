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

- [`help`](docs/help/README.md)
- [`check`](docs/check/README.md)
- [`clean`](docs/clean/README.md)
- [`compare/diff`](docs/compare/README.md)
- [`complete/patch`](docs/complete/README.md)
- [`copy/cp`](docs/copy/README.md)
- [`config`](docs/config/README.md)
- [`export`](docs/export/README.md)
- [`format`](docs/format/README.md)
- [`import`](docs/import/README.md)
- [`pick`](docs/pick/README.md)
- [`remove/rm`](docs/remove/README.md)
- [`rename`](docs/rename/README.md)
- [`translate`](docs/translate/README.md)
