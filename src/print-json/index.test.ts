import type { Plugin } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { printers as estreePrinters } from 'prettier/plugins/estree';
import { expect, test } from 'vite-plus/test';
import { options as pluginOptions } from '../index.ts';
import printJSON from './index.ts';

const AST_FORMAT = 'estree-json-test';

const plugin: Plugin = {
	options: pluginOptions,
	parsers: {
		json: {
			...babelParsers.json,
			astFormat: AST_FORMAT,
		},
		jsonc: {
			...babelParsers.jsonc,
			astFormat: AST_FORMAT,
		},
	},
	printers: {
		[AST_FORMAT]: {
			...estreePrinters.estree,
			print: printJSON,
		},
	},
};

test('expands non-empty arrays and objects', async () => {
	const output = await format(
		'{"foo":[1,2],"bar":/* Comment */{"baz":[3]},"qux":[],"quux":{}}',
		{
			jsonCollectionWrap: 'expand',
			parser: 'json',
			plugins: [plugin],
		}
	);

	expect(output).toMatchInlineSnapshot(`
		"{
		  "foo": [
		    1,
		    2
		  ],
		  "bar": /* Comment */ {
		    "baz": [
		      3
		    ]
		  },
		  "qux": [],
		  "quux": {}
		}
		"
	`);
});

test('preserves dangling comments in arrays', async () => {
	const output = await format('{"foo":[/* Comment */]}', {
		jsonCollectionWrap: 'expand',
		parser: 'jsonc',
		plugins: [plugin],
	});

	expect(output).toMatchInlineSnapshot(`
		"{
		  "foo": [
		    /* Comment */
		  ],
		}
		"
	`);
});

test('preserves dangling comments in nested containers', async () => {
	const output = await format('{"foo":[{/* Comment */}]}', {
		jsonCollectionWrap: 'expand',
		parser: 'jsonc',
		plugins: [plugin],
	});

	expect(output).toMatchInlineSnapshot(`
		"{
		  "foo": [
		    {
		      /* Comment */
		    },
		  ],
		}
		"
	`);
});

test('preserves dangling comments in objects', async () => {
	const output = await format('{"foo":{/* Comment */}}', {
		jsonCollectionWrap: 'expand',
		parser: 'jsonc',
		plugins: [plugin],
	});

	expect(output).toMatchInlineSnapshot(`
		"{
		  "foo": {
		    /* Comment */
		  },
		}
		"
	`);
});

test('keeps truly empty arrays and objects compact', async () => {
	const output = await format('{"foo":[],"bar":{}}', {
		jsonCollectionWrap: 'expand',
		parser: 'jsonc',
		plugins: [plugin],
	});

	expect(output).toMatchInlineSnapshot(`
		"{
		  "foo": [],
		  "bar": {},
		}
		"
	`);
});

test('collapses arrays and objects that fit on one line', async () => {
	const output = await format(
		'{\n"foo":[{"bar":1,"baz":2},{"qux":3,"quux":4}],\n"corge":{\n"grault":5\n}\n}',
		{
			jsonCollectionWrap: 'collapse',
			parser: 'json',
			plugins: [plugin],
		}
	);

	expect(output).toMatchInlineSnapshot(`
		"{
		  "foo": [{ "bar": 1, "baz": 2 }, { "qux": 3, "quux": 4 }],
		  "corge": { "grault": 5 }
		}
		"
	`);
});
