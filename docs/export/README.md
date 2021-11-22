# `export` command

Export files as CSV.

## Arguments

### `<translations>`

Glob of the translation files.

## Usage

Given these translation files:

`examples/en.json`:

```json
{
  "about": "About",
  "hello": "Hello",
  "parent": {
    "child": "Nested item"
  },
  "sentence": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
}
```

`examples/fr.json`:

```json
{
  "hello": "Bonjour",
  "parent": {
    "child": "Élément imbriqué"
  },
  "sentence": "Aenean risus odio, fermentum eu purus a, laoreet interdum nunc."
}
```

Run:

    $ lukos export "examples/??.json" > examples.csv

Then you have in `examples.csv`:

```csv
key,en,fr
hello,Hello,Bonjour
about,About,
sentence,"Lorem ipsum dolor sit amet, consectetur adipiscing elit.","Aenean risus odio, fermentum eu purus a, laoreet interdum nunc."
parent.child,Nested item,Élément imbriqué
```
