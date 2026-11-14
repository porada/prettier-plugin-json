<p align="center">
    <a href="https://github.com/porada/prettier-plugin-json">
        <picture>
            <source
                srcset="https://github.com/porada/prettier-plugin-json/blob/main/.github/assets/prettier-plugin-json-dark-scheme@3x.png?raw=true"
                media="(prefers-color-scheme: dark)"
            />
            <source
                srcset="https://github.com/porada/prettier-plugin-json/blob/main/.github/assets/prettier-plugin-json-light-scheme@3x.png?raw=true"
                media="(prefers-color-scheme: light)"
            />
            <img
                src="https://github.com/porada/prettier-plugin-json/blob/main/.github/assets/prettier-plugin-json-light-scheme@3x.png?raw=true"
                width="520"
                alt=""
            />
        </picture>
    </a>
</p>

<h1 align="center">prettier-plugin-json</h1>

<p align="center">Additional JSON and&nbsp;JSONC formatting options&nbsp;for&nbsp;Prettier.</p>

<p align="center">
    <a href="https://npmx.dev/package/prettier-plugin-json"
        ><img
            src="https://img.shields.io/npm/v/prettier-plugin-json?style=flat-square"
            alt=""
    /></a>
    <a href="https://github.com/porada/prettier-plugin-json/actions/workflows/test.yaml"
        ><img
            src="https://img.shields.io/github/actions/workflow/status/porada/prettier-plugin-json/test.yaml?style=flat-square"
            alt=""
    /></a>
    <a href="https://codecov.io/github/porada/prettier-plugin-json"
        ><img
            src="https://img.shields.io/codecov/c/github/porada/prettier-plugin-json?style=flat-square"
            alt=""
    /></a>
</p>

<div>&nbsp;</div>

## Install

```sh
npm install --save-dev prettier-plugin-json
```

```sh
pnpm add --save-dev prettier-plugin-json
```

## Usage

Reference `prettier-plugin-json` in your [Prettier config](https://prettier.io/docs/configuration):

```json
{
    "plugins": [
        "prettier-plugin-json"
    ]
}
```

If you’re using any other JSON plugins, make sure `prettier-plugin-json` is listed last. This applies to each `overrides` entry as well.

```json
{
    "plugins": [
        "prettier-plugin-sort-json",
        "prettier-plugin-json"
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
                    "prettier-plugin-json"
                ]
            }
        }
    ]
}
```

## Options

In addition to Prettier’s [built-in options](https://prettier.io/docs/options) that affect JSON formatting, `prettier-plugin-json` offers additional configuration options.

```ts
interface PluginOptions {
    /**
     * Control wrapping for arrays and objects. `collapse` formats collections
     * on a single line when they fit within the configured line length.
     * `expand` always uses the multi-line format for non-empty collections.
     * `inherit` follows Prettier’s wrapping behavior for the current parser.
     * @default 'inherit'
     */
    jsonCollectionWrap?: 'collapse' | 'expand' | 'inherit' | undefined;
}
```

## FAQ

### How do `expand` and `collapse` affect JSON wrapping?

With `expand`, each array item and object property starts on a separate line. Empty arrays and objects stay compact.

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
