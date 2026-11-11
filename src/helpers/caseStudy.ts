import {
	BLOCKS,
	MARKS,
	type Block,
	type Document,
	type Inline,
	type Text,
	type TopLevelBlock,
} from '@contentful/rich-text-types';

import type {
	CaseStudyAsset,
	CaseStudyHighlight,
	CaseStudyMetric,
	CaseStudySection,
	CaseStudySectionKey,
} from 'types/caseStudy';

type Node = Block | Inline | Text;

/**
 * Case studies are authored in the existing PortfolioDetails `description`
 * rich-text field: an H2 whose text matches one of these starts that section.
 * Unrecognised H2s stay inside the section they appear in.
 */
const HEADING_ALIASES: Record<
	Exclude<CaseStudySectionKey, 'gallery'>,
	RegExp
> = {
	problem: /^(the\s+)?(problem|challenge|context|brief)$/i,
	approach: /^(the\s+)?(approach|solution|process)$/i,
	architecture: /^(the\s+)?(architecture|system design|how it works)$/i,
	outcome: /^(the\s+)?(outcome|outcomes|results?|impact)$/i,
};

type AuthoredKey = keyof typeof HEADING_ALIASES;

const textOf = (node: Node): string =>
	node.nodeType === 'text'
		? (node as Text).value
		: (node as Block | Inline).content.map(textOf).join('');

const matchHeading = (node: TopLevelBlock): AuthoredKey | null => {
	if (node.nodeType !== BLOCKS.HEADING_2) return null;
	const text = textOf(node).trim().replace(/[.:]$/, '');
	const entry = Object.entries(HEADING_ALIASES).find(([, re]) => re.test(text));
	return entry ? (entry[0] as AuthoredKey) : null;
};

const isAsset = (node: TopLevelBlock): boolean =>
	node.nodeType === BLOCKS.EMBEDDED_ASSET;

const toDocument = (content: TopLevelBlock[]): Document | undefined =>
	content.some((node) => textOf(node).trim() || isAsset(node))
		? { nodeType: BLOCKS.DOCUMENT, data: {}, content }
		: undefined;

export const splitByHeadings = (
	doc: Document
): { intro: TopLevelBlock[] } & Partial<
	Record<AuthoredKey, TopLevelBlock[]>
> => {
	const result: { intro: TopLevelBlock[] } & Partial<
		Record<AuthoredKey, TopLevelBlock[]>
	> = { intro: [] };
	let current: TopLevelBlock[] = result.intro;

	for (const node of doc.content) {
		const key = matchHeading(node);
		if (key) {
			current = result[key] ??= [];
			continue;
		}
		current.push(node);
	}

	return result;
};

/** "Paywall-free by design: Every feature unlocked…" → title + body. */
export const splitHighlight = (feature: string): CaseStudyHighlight => {
	const match = feature.match(/^([^:]{2,60}):\s+([\s\S]+)$/);
	return match
		? { title: match[1].trim(), body: match[2].trim() }
		: { body: feature.trim() };
};

/**
 * Outcome list items that open with bold text are metrics:
 * "**3×** faster indexing" → { value: '3×', label: 'faster indexing' }.
 */
const metricFromItem = (item: Block): CaseStudyMetric | null => {
	const paragraph = item.content[0] as Block | undefined;
	const [first, ...rest] = (paragraph?.content ?? []) as Node[];
	if (
		!first ||
		first.nodeType !== 'text' ||
		!(first as Text).marks.some((m) => m.type === MARKS.BOLD)
	) {
		return null;
	}
	const value = (first as Text).value.trim();
	const label = rest
		.map(textOf)
		.join('')
		.replace(/^\s*[—–:-]?\s*/, '')
		.trim();
	return value && label ? { value, label } : null;
};

export const extractMetrics = (
	content: TopLevelBlock[]
): { metrics: CaseStudyMetric[]; rest: TopLevelBlock[] } => {
	const metrics: CaseStudyMetric[] = [];
	const rest: TopLevelBlock[] = [];

	for (const node of content) {
		const isList =
			node.nodeType === BLOCKS.UL_LIST || node.nodeType === BLOCKS.OL_LIST;
		const parsed = isList ? (node.content as Block[]).map(metricFromItem) : [];
		if (isList && parsed.length > 0 && parsed.every(Boolean)) {
			metrics.push(...(parsed as CaseStudyMetric[]));
		} else {
			rest.push(node);
		}
	}

	return { metrics, rest };
};

const findDiagram = (
	content: TopLevelBlock[],
	assets: Map<string, CaseStudyAsset>
): { diagram?: CaseStudyAsset; rest: TopLevelBlock[] } => {
	const index = content.findIndex((node) => {
		if (!isAsset(node)) return false;
		const asset = assets.get(node.data?.target?.sys?.id);
		return Boolean(asset?.contentType?.startsWith('image/'));
	});
	if (index === -1) return { rest: content };
	const diagram = assets.get(content[index].data.target.sys.id);
	return { diagram, rest: content.filter((_, i) => i !== index) };
};

export interface CaseStudyInput {
	description?: { json: Document } | null;
	features?: string[] | null;
	assets?: Map<string, CaseStudyAsset>;
	hasGallery?: boolean;
}

/**
 * Problem → Approach → Architecture → Outcome → Gallery. Entries that have
 * not been restructured with H2s still render honestly: the description
 * becomes "Overview" and the feature list becomes "Features".
 */
export const buildCaseStudy = ({
	description,
	features,
	assets = new Map(),
	hasGallery = false,
}: CaseStudyInput): CaseStudySection[] => {
	const parts = description?.json
		? splitByHeadings(description.json)
		: { intro: [] };
	const sections: CaseStudySection[] = [];
	const highlights = (features ?? []).filter(Boolean).map(splitHighlight);

	const problemBody = toDocument([...parts.intro, ...(parts.problem ?? [])]);
	if (problemBody) {
		sections.push({
			key: 'problem',
			label: parts.problem ? 'Problem' : 'Overview',
			body: problemBody,
		});
	}

	const approachBody = parts.approach && toDocument(parts.approach);
	if (approachBody || highlights.length > 0) {
		sections.push({
			key: 'approach',
			label: parts.approach ? 'Approach' : 'Features',
			body: approachBody,
			highlights: highlights.length > 0 ? highlights : undefined,
		});
	}

	if (parts.architecture) {
		const { diagram, rest } = findDiagram(parts.architecture, assets);
		const body = toDocument(rest);
		if (diagram || body) {
			sections.push({
				key: 'architecture',
				label: 'Architecture',
				body,
				diagram,
			});
		}
	}

	if (parts.outcome) {
		const { metrics, rest } = extractMetrics(parts.outcome);
		const body = toDocument(rest);
		if (metrics.length > 0 || body) {
			sections.push({
				key: 'outcome',
				label: 'Outcome',
				body,
				metrics: metrics.length > 0 ? metrics : undefined,
			});
		}
	}

	if (hasGallery) sections.push({ key: 'gallery', label: 'Gallery' });

	return sections;
};

/** The project after `id` in the homepage works order, wrapping to the first. */
export const nextInOrder = <T extends { id?: number }>(
	order: T[],
	id: number
): { item: T; position: number; total: number } | null => {
	const ids = order.filter((item) => item.id !== undefined);
	if (ids.length < 2) return null;
	const index = ids.findIndex((item) => item.id === id);
	if (index === -1) return { item: ids[0], position: 1, total: ids.length };
	const nextIndex = (index + 1) % ids.length;
	return { item: ids[nextIndex], position: nextIndex + 1, total: ids.length };
};

export const positionOf = (
	order: { id?: number }[],
	id: number
): { position: number; total: number } | null => {
	const index = order.findIndex((item) => item.id === id);
	return index === -1 ? null : { position: index + 1, total: order.length };
};
