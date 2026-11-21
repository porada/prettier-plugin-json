import type { Parser, ParserOptions, Plugin } from 'prettier';

export interface PluginOptions {
	/**
	 * Choose how non-empty arrays and objects wrap. `collapse` uses one line
	 * when they fit. `expand` puts each item or property on its own line.
	 * `inherit` follows the current parser’s wrapping rules.
	 *
	 * @default 'inherit'
	 */
	jsonCollectionWrap?: 'collapse' | 'expand' | 'inherit' | undefined;
}

declare module 'prettier' {
	interface Options extends PluginOptions {}
}

export type ParserDelegation = {
	hook: ParserHookName;
	parserName: ParserName;
	resolveNext: () => Promise<ResolvedPriorParser | undefined>;
};

export type ParserHookName = 'parse' | 'preprocess';

export type ParserInitializer = () => Parser | Promise<Parser>;

export type ParserName = 'json' | 'json-stringify' | 'jsonc';

export type ParseWithCompatibility = (
	this: Parser,
	text: string,
	options: ParserOptions,
	optionsForCompatibility: ParserOptions
) => unknown;

export type PluginWithParsers = Omit<Plugin, 'parsers'> & {
	parsers: Record<string, Parser | ParserInitializer>;
};

export type ResolvedPriorParser = {
	delegation?: ParserDelegation;
	entryOptions?: Pick<ParserOptions, 'locEnd' | 'locStart' | 'plugins'>;
	lifecycleState: Partial<
		Pick<ParserOptions, 'locEnd' | 'locStart' | 'plugins'>
	>;
	parser: Parser;
	plugins: ParserOptions['plugins'];
};
