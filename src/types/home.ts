import type { Document } from '@contentful/rich-text-types';

import type { Experience } from 'types/career';
import type { Certification } from 'types/certification';
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

/** A hand-entered About stat (counted ones are added on the page). */
export interface ManualStat {
	value: number;
	suffix?: string;
	label: string;
	compact?: boolean;
}

export interface Collaborator {
	name: string;
	url: string;
	logoUrl: string;
	/** CSS aspect-ratio from the logo's intrinsic size, e.g. "558 / 167". */
	ratio: string;
	/** Near-square marks get extra height to read at the same weight. */
	tall: boolean;
}

/** "I build {word} that…" split around the token the words cycle through. */
export interface Manifesto {
	before: string;
	after: string;
	words: string[];
}

export interface HomeContent {
	/** Section keys in the order Page "home" lists them. */
	order: HomeSectionKey[];
	hero: { pitch?: Document; ctas: SiteLink[] };
	/** Absent until the statement has a {word} token and at least two words. */
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
	collaborations: SectionHeading & { items: Collaborator[] };
	testimonials: SectionHeading & { items: Testimonial[] };
}
