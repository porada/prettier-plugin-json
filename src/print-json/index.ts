import type { Doc, Printer } from 'prettier';
import type { PluginOptions } from '../types/index.d.ts';
import { doc } from 'prettier';
import { printers as estreePrinters } from 'prettier/plugins/estree';

type AttachedComment = {
	leading?: boolean;
	trailing?: boolean;
};

type JSONContainerType = 'array' | 'object';

/**
 * Checks whether a node has comments that are neither leading nor trailing.
 */
function hasDanglingComments(node: unknown): boolean {
	const { comments } = node as { comments?: AttachedComment[] };
	return (
		comments?.some(({ leading, trailing }) => !leading && !trailing) ===
		true
	);
}

/**
 * Identifies arrays and objects that contain entries or dangling comments.
 */
function getNonEmptyJSONContainerType(
	node: unknown
): JSONContainerType | undefined {
	/* v8 ignore if -- @preserve */
	if (typeof node !== 'object' || node === null || !('type' in node)) {
		return undefined;
	}

	const hasContents = hasDanglingComments(node);

	switch (node.type) {
		case 'ArrayExpression':
			return (node as unknown as { elements: unknown[] }).elements
				.length > 0 || hasContents
				? 'array'
				: undefined;

		case 'ObjectExpression':
			return (node as unknown as { properties: unknown[] }).properties
				.length > 0 || hasContents
				? 'object'
				: undefined;

		default:
			return undefined;
	}
}

/**
 * Unwraps a fill document so the enclosing group controls its line breaks.
 */
function unpackFill(currentDoc: Doc): Doc {
	return typeof currentDoc !== 'string' &&
		!Array.isArray(currentDoc) &&
		currentDoc.type === 'fill'
		? currentDoc.parts
		: currentDoc;
}

/**
 * Forces a group document to break without changing nested groups.
 */
function forceDirectGroupToBreak(currentDoc: Doc): Doc {
	return typeof currentDoc !== 'string' &&
		!Array.isArray(currentDoc) &&
		currentDoc.type === 'group'
		? { ...currentDoc, break: true }
		: currentDoc;
}

/**
 * Updates Prettier’s container group while preserving trailing documents.
 */
function mapNativeContainerGroup(
	printed: Doc,
	callback: (group: doc.builders.Group) => doc.builders.Group
): Doc {
	let structuralGroup: Doc | undefined = printed;

	if (Array.isArray(printed)) {
		[structuralGroup] = printed;
	}

	/* v8 ignore if -- @preserve */
	if (
		typeof structuralGroup !== 'object' ||
		structuralGroup === null ||
		Array.isArray(structuralGroup) ||
		structuralGroup.type !== 'group'
	) {
		return printed;
	}

	const mappedGroup = callback(structuralGroup);

	return Array.isArray(printed)
		? [mappedGroup, ...printed.slice(1)]
		: mappedGroup;
}

/**
 * Applies the selected wrapping behavior while preserving Prettier’s output
 * for `inherit`.
 */
function applyJSONCollectionWrapping(
	printed: Doc,
	node: unknown,
	collectionWrap: PluginOptions['jsonCollectionWrap']
): Doc {
	const containerType = getNonEmptyJSONContainerType(node);

	if (!containerType || collectionWrap === 'inherit') {
		return printed;
	}

	if (collectionWrap === 'collapse') {
		return mapNativeContainerGroup(printed, (group) => ({
			...group,
			break: false,
		}));
	}

	return mapNativeContainerGroup(printed, (group) => ({
		...group,
		break: true,
		contents:
			containerType === 'array'
				? doc.utils.mapDoc(group.contents, unpackFill)
				: forceDirectGroupToBreak(group.contents),
	}));
}

/**
 * Prints with Prettier before applying the selected wrapping behavior.
 */
const printJSON: Printer['print'] = (path, options, print, args) => {
	const { jsonCollectionWrap = 'inherit' } = options as PluginOptions;
	const printed = estreePrinters.estree.print(path, options, print, args);

	return applyJSONCollectionWrapping(printed, path.node, jsonCollectionWrap);
};

export default printJSON;
