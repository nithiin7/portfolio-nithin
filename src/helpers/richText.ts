import {
	BLOCKS,
	type Block,
	type Document,
	type Inline,
	type Text,
} from '@contentful/rich-text-types';

type Node = Block | Inline | Text;

export interface TocItem {
	id: string;
	text: string;
	level: 2 | 3;
}

/** Concatenated text of a rich-text node. */
export const plainText = (node: Node | Document): string =>
	node.nodeType === 'text'
		? (node as Text).value
		: (node as Block).content.map((child) => plainText(child as Node)).join('');

/** URL-safe slug of a text. */
export const slugify = (text: string): string =>
	text
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/[\s-]+/g, '-');

/** Slugifier that suffixes repeats with -2, -3, …. */
export const createSlugger = (): ((text: string) => string) => {
	const seen = new Map<string, number>();
	return (text) => {
		const base = slugify(text) || 'section';
		const count = (seen.get(base) ?? 0) + 1;
		seen.set(base, count);
		return count === 1 ? base : `${base}-${count}`;
	};
};

/** Table-of-contents level for each heading node type. */
export const HEADING_LEVEL: Partial<Record<string, 2 | 3>> = {
	[BLOCKS.HEADING_1]: 2,
	[BLOCKS.HEADING_2]: 2,
	[BLOCKS.HEADING_3]: 3,
};

/** Table-of-contents entries for a rich-text document. */
export const extractHeadings = (doc: Document | undefined): TocItem[] => {
	if (!doc?.content) return [];
	const slug = createSlugger();
	const items: TocItem[] = [];

	const walk = (nodes: Node[]): void => {
		for (const node of nodes) {
			const level = HEADING_LEVEL[node.nodeType];
			if (level) {
				const text = plainText(node).trim();
				if (text) items.push({ id: slug(text), text, level });
				continue;
			}
			if ('content' in node) walk(node.content as Node[]);
		}
	};

	walk(doc.content as Node[]);
	return items;
};

/** Source text of a paragraph that is entirely code, or null. */
export const codeBlockSource = (node: Block): string | null => {
	if (node.nodeType !== BLOCKS.PARAGRAPH || node.content.length === 0) {
		return null;
	}
	const allCode = node.content.every(
		(child) =>
			child.nodeType === 'text' &&
			(child as Text).marks.some((mark) => mark.type === 'code')
	);
	if (!allCode) return null;
	const source = plainText(node).replace(/\s+$/, '');
	return source ? source : null;
};
