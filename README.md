<p align="center">
    <a href="https://github.com/porada/prettier-plugin-expand-json">
        <picture>
            <source
                srcset="https://github.com/porada/prettier-plugin-expand-json/blob/main/.github/assets/prettier-plugin-expand-json-dark-scheme@3x.png?raw=true"
                media="(prefers-color-scheme: dark)"
            />
            <source
                srcset="https://github.com/porada/prettier-plugin-expand-json/blob/main/.github/assets/prettier-plugin-expand-json-light-scheme@3x.png?raw=true"
                media="(prefers-color-scheme: light)"
            />
            <img
                src="https://github.com/porada/prettier-plugin-expand-json/blob/main/.github/assets/prettier-plugin-expand-json-light-scheme@3x.png?raw=true"
                width="520"
                alt=""
            />
        </picture>
    </a>
</p>

<h1 align="center">prettier-plugin-expand&#8209;json</h1>

<p align="center">Expand JSON arrays and objects into multi&#8209;line&nbsp;format with&nbsp;Prettier.</p>

<p align="center">
    <a href="https://npmx.dev/package/prettier-plugin-expand-json"
        ><img
            src="https://img.shields.io/npm/v/prettier-plugin-expand-json?style=flat-square"
            alt=""
    /></a>
    <a href="https://github.com/porada/prettier-plugin-expand-json/actions/workflows/test.yaml"
        ><img
            src="https://img.shields.io/github/actions/workflow/status/porada/prettier-plugin-expand-json/test.yaml?style=flat-square"
            alt=""
    /></a>
    <a href="https://codecov.io/github/porada/prettier-plugin-expand-json"
        ><img
            src="https://img.shields.io/codecov/c/github/porada/prettier-plugin-expand-json?style=flat-square"
            alt=""
    /></a>
</p>

<div>&nbsp;</div>

## Install

```sh
npm install --save-dev prettier-plugin-expand-json
```

```sh
pnpm add --save-dev prettier-plugin-expand-json
```

## Usage

Reference `prettier-plugin-expand-json` in your [Prettier config](https://prettier.io/docs/configuration):

```json
{
    "plugins": [
        "prettier-plugin-expand-json"
    ]
}
```

If you’re using any other JSON plugins, make sure `prettier-plugin-expand-json` is listed last. This applies to each `overrides` entry as well.

```json
{
    "plugins": [
        "prettier-plugin-sort-json",
        "prettier-plugin-expand-json"
    ]
}
```

```json
{
    "overrides": [
        {
            "files": "**/package.json",
            "options": {
                "plugins": [
                    "prettier-plugin-pkg",
                    "prettier-plugin-expand-json"
                ]
            }
        }
    ]
}
```

## Options

In addition to Prettier’s [built-in options](https://prettier.io/docs/options) that affect JSON formatting, `prettier-plugin-expand-json` offers additional configuration options.

```ts
interface PluginOptions {
    /**
     * Control wrapping for arrays and objects. `collapse` formats collections
     * on a single line when they fit within the configured line length.
     * `expand` always uses the multi-line format for non-empty collections.
     * `inherit` follows Prettier’s wrapping behavior for the current parser.
     * @default 'expand'
     */
    jsonCollectionWrap?: 'collapse' | 'expand' | 'inherit' | undefined;
}
```

## FAQ

### How do `expand` and `collapse` affect JSON wrapping?

With `expand`, the default value, each array item and object property starts on a separate line. Empty arrays and objects stay compact.

```json
{
    "extends": "@standard-config/tsconfig",
    "compilerOptions": {
        "types": [
            "node",
            "vitest/globals"
        ]
    }
}
```

With `collapse`, collections are formatted on a single line when they fit within the configured `printWidth`.

<!-- prettier-ignore -->
```json
{
    "extends": "@standard-config/tsconfig",
    "compilerOptions": { "types": ["node", "vitest/globals"] }
}
```

Please note that both `expand` and `collapse` override the configured [`objectWrap`](https://prettier.io/docs/options#object-wrap) value.

### Does this plugin work with files like `package.json` and `composer.json`?

Yes. Prettier uses a separate parser called `json-stringify` to match the formatting of the tools that update these files. This plugin supports that parser, too.

That said, `json-stringify` always expands arrays and objects, and `jsonCollectionWrap` can’t override that behavior. You can use the `json` parser to make Prettier apply the option anyway, but please note that external tools may reformat the entire file when updating it.

```json
{
    "overrides": [
        {
            "files": "**/package.json",
            "options": {
                "parser": "json",
                "jsonCollectionWrap": "collapse"
            }
        }
    ]
}
```

## Related

- [**@standard-config/prettier**](https://github.com/standard-config/prettier)
- [**prettier-plugin-markdown-html**](https://github.com/porada/prettier-plugin-markdown-html)
- [**prettier-plugin-yaml**](https://github.com/porada/prettier-plugin-yaml)

## License

MIT © [Dom Porada](https://dom.engineering)
