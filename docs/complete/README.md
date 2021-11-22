# `complete` / `patch` command

Completes missing keys from a reference file.

> To automatically translate values, you need to [configure the translation API](#translation-api).

## Usage

    $ cat diff.txt | lukos patch

## Arguments

### `stdin`

A diff file as generated by the [`compare` command](../compare/README.md).