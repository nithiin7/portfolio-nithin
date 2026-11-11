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

export const plainText = (node: Node | Document): string =>
	node.nodeType === 'text'
		? (node as Text).value
		: (node as Block).content.map((child) => plainText(child as Node)).join('');

export const slugify = (text: string): string =>
	text
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/[\s-]+/g, '-');

/**
 * Returns a stateful slugger that de-duplicates repeated headings ("setup",
 * "setup-2"). The TOC and the renderer each create one and walk headings in
 * document order, so both arrive at the same ids.
 */
export const createSlugger = (): ((text: string) => string) => {
	const seen = new Map<string, number>();
	return (text) => {
		const base = slugify(text) || 'section';
		const count = (seen.get(base) ?? 0) + 1;
		seen.set(base, count);
		return count === 1 ? base : `${base}-${count}`;
	};
};

// Posts render their own title as the page h1, so CMS H1/H2 both become
// section headings (h2) and H3 becomes a sub-heading.
export const HEADING_LEVEL: Partial<Record<string, 2 | 3>> = {
	[BLOCKS.HEADING_1]: 2,
	[BLOCKS.HEADING_2]: 2,
	[BLOCKS.HEADING_3]: 3,
};

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

/**
 * Contentful rich text has no code-block node; authors mark a whole paragraph
 * as code instead. Returns that paragraph's source, or null for normal prose.
 */
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
