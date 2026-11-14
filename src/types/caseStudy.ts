import type { Document } from '@contentful/rich-text-types';

export type CaseStudySectionKey =
	'problem' | 'approach' | 'architecture' | 'outcome' | 'gallery';

export interface CaseStudyAsset {
	url: string;
	title?: string | null;
	description?: string | null;
	width?: number | null;
	height?: number | null;
	contentType?: string | null;
}

export interface CaseStudyMetric {
	value: string;
	label: string;
}

export interface CaseStudyHighlight {
	title?: string;
	body: string;
}

export interface CaseStudySection {
	key: CaseStudySectionKey;
	label: string;
	body?: Document;
	highlights?: CaseStudyHighlight[];
	diagram?: CaseStudyAsset;
	metrics?: CaseStudyMetric[];
}

export interface CaseStudyNext {
	id: number;
	slug: string;
	title: string;
	image?: string;
	imageDark?: string;
	blurDataURL?: string;
	blurDataURLDark?: string;
	position: number;
	total: number;
}
