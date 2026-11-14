import type { Document } from '@contentful/rich-text-types';

import type { Experience } from 'types/career';
import type { Certification } from 'types/certification';
import type { Company } from 'types/company';
import type { PortfolioItem } from 'types/portfolio';
import type { SiteLink } from 'types/site';
import type { Testimonial } from 'types/testimony';

export type HomeSectionKey =
	| 'hero'
	| 'manifesto'
	| 'work'
	| 'about'
	| 'capabilities'
	| 'career'
	| 'certifications'
	| 'collaborations'
	| 'testimonials';

export interface SectionHeading {
	heading?: string;
	lede?: string;
}

export interface Capability {
	title: string;
	summary: string;
	items: string[];
}

export interface Principle {
	title: string;
	body: string;
}

export interface ManualStat {
	value: number;
	suffix?: string;
	label: string;
	compact?: boolean;
}

export interface Manifesto {
	before: string;
	after: string;
	words: string[];
}

export interface HomeContent {
	order: HomeSectionKey[];
	hero: { pitch?: Document; ctas: SiteLink[] };
	manifesto?: Manifesto;
	work: SectionHeading & { projects: PortfolioItem[] };
	about: SectionHeading & {
		bio: string[];
		portrait?: { url: string; alt: string };
		principles: Principle[];
		stats: ManualStat[];
	};
	capabilities: SectionHeading & { items: Capability[] };
	career: SectionHeading & { experiences: Experience[] };
	certifications: SectionHeading & { items: Certification[] };
	collaborations: SectionHeading & { items: Company[] };
	testimonials: SectionHeading & { items: Testimonial[] };
}
