import type { Parser, ParserOptions, Plugin } from 'prettier';
import type { ParserName, PluginOptions } from './types/index.d.ts';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import * as pluginEstree from 'prettier/plugins/estree';
import {
	callParserWithCompatibility,
	createPriorParserResolver,
	markParserAsOwn,
	withPriorParserOptions,
} from './plugin-hooks/index.ts';
import printJSON from './print-json/index.ts';

const estreeOptions = (pluginEstree as Plugin).options!;
const { printers: estreePrinters } = pluginEstree;

const PLUGIN_ESTREE_FORMAT = 'prettier-plugin-json.estree';

function createParser(name: ParserName): Parser {
	async function parse(
		text: string,
		options: ParserOptions
	): Promise<unknown> {
		const resolvedPriorParser = await resolvePriorParser(options, 'parse');
		const priorParser = resolvedPriorParser?.parser;

		if (
			resolvedPriorParser &&
			priorParser &&
			typeof priorParser.parse === 'function' &&
			priorParser.parse !== parse
		) {
			return withPriorParserOptions(
				options,
				resolvedPriorParser,
				(delegatedOptions) =>
					callParserWithCompatibility(
						priorParser,
						text,
						delegatedOptions
					)
			);
		}

		return await babelParsers[name].parse(text, options);
	}

	const preprocess: NonNullable<Parser['preprocess']> = async (
		text: string,
		options: ParserOptions
	) => {
		const resolvedPriorParser = await resolvePriorParser(
			options,
			'preprocess'
		);

		const priorParser = resolvedPriorParser?.parser;
		const priorPreprocess = priorParser?.preprocess;

		if (
			resolvedPriorParser &&
			priorParser &&
			typeof priorPreprocess === 'function' &&
			priorPreprocess !== preprocess
		) {
			return withPriorParserOptions(
				options,
				resolvedPriorParser,
				(delegatedOptions): Promise<string> | string =>
					priorPreprocess.call(priorParser, text, delegatedOptions)
			);
		}

		return text;
	};

	const parser: Parser = {
		...babelParsers[name],
		astFormat:
			name === 'json-stringify'
				? babelParsers[name].astFormat
				: PLUGIN_ESTREE_FORMAT,
		parse,
		preprocess,
	};

	const resolvePriorParser = createPriorParserResolver(
		name,
		babelParsers[name].astFormat,
		parser
	);

	return markParserAsOwn(parser);
}

export const parsers: Plugin['parsers'] = {
	'json': createParser('json'),
	'json-stringify': createParser('json-stringify'),
	'jsonc': createParser('jsonc'),
};

export const printers: Plugin['printers'] = {
	[PLUGIN_ESTREE_FORMAT]: {
		...estreePrinters.estree,
		print: printJSON,
	},
	'estree-json': estreePrinters['estree-json'],
};

export const options: Plugin['options'] = {
	...estreeOptions,
	jsonCollectionWrap: {
		category: 'JSON',
		description: 'Choose how non-empty arrays and objects wrap.',
		type: 'choice',
		default: 'inherit',
		choices: [
			{
				description: 'Use one line when the collection fits.',
				value: 'collapse',
			},
			{
				description: 'Put each item or property on its own line.',
				value: 'expand',
			},
			{
				description:
					'Follow Prettier’s wrapping behavior for the current parser.',
				value: 'inherit',
			},
		],
	},
};

export type { PluginOptions };
