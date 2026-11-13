/**
 * Raw Contentful GraphQL response shapes (src/queries). Converters in
 * helpers/contentful.ts turn these into the app types components use.
 */
import type { Document } from '@contentful/rich-text-types';

import type { CaseStudyAsset } from 'types/caseStudy';
import type { HomeSectionKey } from 'types/home';
import type { LinkIcon } from 'types/site';

type Maybe<T> = T | null | undefined;

export interface RawAsset {
	url: string;
	title?: Maybe<string>;
	description?: Maybe<string>;
	width?: Maybe<number>;
	height?: Maybe<number>;
	contentType?: Maybe<string>;
}

export interface RawSeo {
	title?: Maybe<string>;
	description?: Maybe<string>;
	noIndex?: Maybe<boolean>;
	ogImage?: Maybe<{ url: string }>;
}

export interface RawLink {
	label: string;
	url: string;
	icon?: Maybe<LinkIcon>;
	detail?: Maybe<string>;
	openInNewTab?: Maybe<boolean>;
	logo?: Maybe<{ url: string; width?: Maybe<number>; height?: Maybe<number> }>;
}

export interface RawCompany {
	name: string;
	slug: string;
	websiteUrl?: Maybe<string>;
	showLogo?: Maybe<boolean>;
	logo?: Maybe<{ url: string; width?: Maybe<number>; height?: Maybe<number> }>;
}

export interface RawSiteSettings {
	name: string;
	role: string;
	company: string;
	city: string;
	region?: Maybe<string>;
	countryCode: string;
	timeZone: string;
	isAvailable?: Maybe<boolean>;
	availabilityLabel: string;
	email: string;
	knowsAbout?: Maybe<string[]>;
	twitterHandle?: Maybe<string>;
	socialsCollection?: Maybe<{ items: Maybe<RawLink>[] }>;
	contactChannelsCollection?: Maybe<{ items: Maybe<RawLink>[] }>;
	seo?: Maybe<RawSeo>;
}

export interface RawProjectCard {
	sys: { id: string };
	id?: Maybe<number>;
	slug: string;
	title: string;
	shortDescription?: Maybe<string>;
	year?: Maybe<string>;
	role?: Maybe<string>;
	tech?: Maybe<string[]>;
	techHighlights?: Maybe<string[]>;
	demo?: Maybe<string>;
	github?: Maybe<string>;
	spotlightImage?: Maybe<RawAsset>;
	spotlightImageDark?: Maybe<RawAsset>;
}

export interface RawProject extends RawProjectCard {
	description?: Maybe<{
		json: Document;
		links?: {
			assets?: {
				block?: ({ sys: { id: string } } & CaseStudyAsset)[];
			};
		};
	}>;
	galleryCollection?: Maybe<{ items: Maybe<RawAsset>[] }>;
	features?: Maybe<string[]>;
	seo?: Maybe<RawSeo>;
}

/** A Home Section item; `__typename` says which fields are present. */
export type RawSectionItem =
	| ({ __typename: 'PortfolioDetails' } & RawProjectCard)
	| {
			__typename: 'Capability';
			title: string;
			summary?: Maybe<string>;
			items?: Maybe<string[]>;
	  }
	| {
			__typename: 'CareerExperience';
			sys: { id: string };
			title: string;
			/** Deprecated text field, aliased: `company` is a link on Testimonial. */
			companyName?: Maybe<string>;
			employer?: Maybe<RawCompany>;
			location?: Maybe<string>;
			type?: Maybe<string>;
			startDate: string;
			endDate?: Maybe<string>;
			description?: Maybe<string>;
			techStack?: Maybe<string[]>;
	  }
	| {
			__typename: 'Certification';
			sys: { id: string };
			name: string;
			slug?: Maybe<string>;
			provider: string;
			providerLogo?: Maybe<{ url: string }>;
			certificateUrl?: Maybe<string>;
			credentialId?: Maybe<string>;
			issuedOn: string;
			expiresOn?: Maybe<string>;
			highlight?: Maybe<boolean>;
	  }
	| {
			__typename: 'TestimonialCard';
			sys: { id: string };
			review: string;
			reviewer: string;
			authorRole?: Maybe<string>;
			organisation?: Maybe<string>;
			company?: Maybe<RawCompany>;
			avatar?: Maybe<{ url: string }>;
	  }
	| ({ __typename: 'Company' } & RawCompany)
	| { __typename: 'Principle'; title: string; body: string }
	| ({ __typename: 'Link' } & RawLink);

export interface RawHomeSection {
	key?: Maybe<HomeSectionKey>;
	heading?: Maybe<string>;
	lede?: Maybe<string>;
	words?: Maybe<string[]>;
	body?: Maybe<{ json: Document }>;
	image?: Maybe<RawAsset>;
	itemsCollection?: Maybe<{ items: Maybe<RawSectionItem>[] }>;
	statsCollection?: Maybe<{
		items: Maybe<{
			value: number;
			suffix?: Maybe<string>;
			label: string;
			isCompact?: Maybe<boolean>;
		}>[];
	}>;
	ctasCollection?: Maybe<{ items: Maybe<RawLink>[] }>;
}

export interface HomeResponse {
	pageCollection: {
		items: { sectionCollection?: Maybe<{ items: Maybe<RawHomeSection>[] }> }[];
	};
}

export interface SiteSettingsResponse {
	siteSettingsCollection: { items: RawSiteSettings[] };
}

export interface PageSeoResponse {
	pageCollection: { items: { seo?: Maybe<RawSeo> }[] };
}

export interface ProjectResponse {
	portfolioDetailsCollection: { items: RawProject[] };
}

export interface WorkResponse {
	sectionCollection: {
		items: { itemsCollection?: Maybe<{ items: Maybe<RawProjectCard>[] }> }[];
	};
}

export interface BlogPostItem {
	sys: { id: string };
	title: string;
	slug: string;
	excerpt: string;
	content?: {
		json: Document;
		links?: {
			assets?: {
				block?: {
					sys: { id: string };
					url: string;
					title: string;
					description?: string;
				}[];
			};
		};
	};
	featuredImage?: Maybe<{ url: string; title?: string; description?: string }>;
	blogCategory?: Maybe<{ name: string }>;
	tags?: Maybe<string[]>;
	author?: Maybe<{
		name: string;
		avatar?: Maybe<{ url: string; title?: string; description?: string }>;
	}>;
	publishedDate: string;
	updatedDate?: Maybe<string>;
	readTime: number;
	seo?: Maybe<RawSeo>;
}

export interface BlogPostsResponse {
	blogPostCollection: { total: number; items: BlogPostItem[] };
}

export interface BlogPostBySlugResponse {
	blogPostCollection: { items: BlogPostItem[] };
}
