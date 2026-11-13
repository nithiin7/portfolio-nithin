import 'server-only';

import type {
	ApolloClient,
	OperationVariables,
	TypedDocumentNode,
} from '@apollo/client';
import { BLOCKS, type Document } from '@contentful/rich-text-types';
import type { DocumentNode } from 'graphql';
import { cache } from 'react';

import { getApolloClient } from 'clients/apollo';
import { sortByStart, toExperience } from 'helpers/career';
import { serverEnv } from 'helpers/env';
import { plainText } from 'helpers/richText';
import {
	GET_ALL_BLOG_POSTS,
	GET_BLOG_POST_BY_SLUG,
	GET_HOME,
	GET_PAGE_SEO,
	GET_SITE_SETTINGS,
} from 'queries/index';
import {
	GET_PROJECT,
	GET_PROJECT_SLUG_BY_LEGACY_ID,
	GET_WORK,
} from 'queries/portfolio';
import type { BlogPost } from 'types/blog';
import type { Certification } from 'types/certification';
import type {
	BlogPostBySlugResponse,
	BlogPostItem,
	BlogPostsResponse,
	HomeResponse,
	PageSeoResponse,
	ProjectResponse,
	RawHomeSection,
	RawLink,
	RawProject,
	RawProjectCard,
	RawSectionItem,
	RawSeo,
	RawSiteSettings,
	SiteSettingsResponse,
	WorkResponse,
} from 'types/contentful';
import type {
	Collaborator,
	HomeContent,
	HomeSectionKey,
	Manifesto,
	SectionHeading,
} from 'types/home';
import type { PortfolioItem } from 'types/portfolio';
import type { Seo, SiteLink, SiteSettings } from 'types/site';
import type { Testimonial } from 'types/testimony';

type QueryResult<TData> = ApolloClient.QueryResult<TData, 'none'>;

const isUnresolvableLink = (error: { extensions?: unknown }): boolean =>
	(error.extensions as { contentful?: { code?: string } } | undefined)
		?.contentful?.code === 'UNRESOLVABLE_LINK';

const runQuery = async <TData>(
	query: DocumentNode,
	variables: OperationVariables = {}
): Promise<QueryResult<TData>> => {
	// A link to an unpublished entry (e.g. one still failing validation) comes
	// back as an UNRESOLVABLE_LINK error with that field nulled. Render without
	// it; any other GraphQL error still fails the request.
	const { data, error } = await getApolloClient().query({
		query: query as TypedDocumentNode<TData, OperationVariables>,
		variables: { ...variables, preview: serverEnv.CONTENTFUL_PREVIEW },
		errorPolicy: 'all',
	});
	const errors =
		error && 'errors' in error
			? (error.errors as readonly { extensions?: unknown }[])
			: error
				? [error as { extensions?: unknown }]
				: [];
	if (!data || errors.some((item) => !isUnresolvableLink(item))) {
		throw error ?? new Error('Contentful returned no data');
	}
	return { data: data as TData };
};

const compact = <T>(items: (T | null | undefined)[] | undefined | null): T[] =>
	(items ?? []).filter((item): item is T => item != null);

/** Contentful asset URLs are protocol-relative ("//images.ctfassets.net/…"). */
const httpsUrl = (url: string): string =>
	url.startsWith('//') ? `https:${url}` : url;

const toSeo = (raw: RawSeo | null | undefined): Seo | undefined =>
	raw?.title && raw.description
		? {
				title: raw.title,
				description: raw.description,
				ogImage: raw.ogImage?.url,
				noIndex: raw.noIndex ?? false,
			}
		: undefined;

const toLink = (raw: RawLink): SiteLink => ({
	label: raw.label,
	url: raw.url,
	icon: raw.icon ?? undefined,
	detail: raw.detail ?? undefined,
	openInNewTab: raw.openInNewTab ?? true,
});

// ── Site settings ──────────────────────────────────────────────────────────

const toSiteSettings = (raw: RawSiteSettings): SiteSettings => ({
	name: raw.name,
	role: raw.role,
	company: raw.company,
	location: {
		city: raw.city,
		region: raw.region ?? undefined,
		country: raw.countryCode,
		timeZone: raw.timeZone,
	},
	availability: {
		open: raw.isAvailable ?? false,
		label: raw.availabilityLabel,
	},
	email: raw.email,
	socials: compact(raw.socialsCollection?.items).map(toLink),
	contactChannels: compact(raw.contactChannelsCollection?.items).map(toLink),
	knowsAbout: raw.knowsAbout ?? [],
	seo: toSeo(raw.seo) ?? {
		title: `${raw.name} — ${raw.role} @ ${raw.company}`,
		description: `${raw.role} at ${raw.company}.`,
	},
	twitterHandle: raw.twitterHandle ?? undefined,
});

/** The Site Settings singleton, fetched once per request. */
export const loadSiteSettings = cache(async (): Promise<SiteSettings> => {
	const { data } = await runQuery<SiteSettingsResponse>(GET_SITE_SETTINGS);
	const raw = data.siteSettingsCollection.items[0];
	if (!raw) throw new Error('Contentful has no Site Settings entry');
	return toSiteSettings(raw);
});

export const loadPageSeo = async (slug: string): Promise<Seo | undefined> => {
	const { data } = await runQuery<PageSeoResponse>(GET_PAGE_SEO, { slug });
	return toSeo(data.pageCollection.items[0]?.seo);
};

// ── Projects ───────────────────────────────────────────────────────────────

export const toPortfolioItem = (raw: RawProjectCard): PortfolioItem => ({
	id: raw.id ?? undefined,
	slug: raw.slug,
	title: raw.title,
	image: {
		url: raw.spotlightImage?.url ?? '',
		description: raw.spotlightImage?.description,
	},
	imageDark: raw.spotlightImageDark
		? {
				url: raw.spotlightImageDark.url,
				description: raw.spotlightImageDark.description,
			}
		: null,
	summary: raw.shortDescription ?? undefined,
	year: raw.year ?? undefined,
	role: raw.role ?? undefined,
	tech: raw.techHighlights?.length
		? raw.techHighlights
		: (raw.tech ?? []).slice(0, 4),
	demo: raw.demo ?? undefined,
});

export const loadProject = async (
	slug: string
): Promise<RawProject | undefined> => {
	const { data } = await runQuery<ProjectResponse>(GET_PROJECT, { slug });
	return data.portfolioDetailsCollection.items[0];
};

export const loadProjectSlugByLegacyId = async (
	id: number
): Promise<string | undefined> => {
	const { data } = await runQuery<ProjectResponse>(
		GET_PROJECT_SLUG_BY_LEGACY_ID,
		{ id }
	);
	return data.portfolioDetailsCollection.items[0]?.slug;
};

/** The homepage Work list (curated set and order of live projects). */
export const loadWork = cache(async (): Promise<PortfolioItem[]> => {
	// An unpublished project is an UNRESOLVABLE_LINK error with that item
	// nulled; keep the rest rather than failing the case study page
	const { data } = await getApolloClient().query({
		query: GET_WORK as TypedDocumentNode<WorkResponse>,
		variables: { preview: serverEnv.CONTENTFUL_PREVIEW },
		errorPolicy: 'all',
	});
	return compact(
		data?.sectionCollection?.items?.[0]?.itemsCollection?.items
	).map(toPortfolioItem);
});

// ── Homepage ───────────────────────────────────────────────────────────────

const heading = (section: RawHomeSection | undefined): SectionHeading => ({
	heading: section?.heading ?? undefined,
	lede: section?.lede ?? undefined,
});

const itemsOf = <T extends RawSectionItem['__typename']>(
	section: RawHomeSection | undefined,
	typename: T
): Extract<RawSectionItem, { __typename: T }>[] =>
	compact(section?.itemsCollection?.items).filter(
		(item): item is Extract<RawSectionItem, { __typename: T }> =>
			item.__typename === typename
	);

const paragraphs = (doc: Document | undefined): string[] =>
	(doc?.content ?? [])
		.filter((node) => node.nodeType === BLOCKS.PARAGRAPH)
		.map((node) => plainText(node).trim())
		.filter(Boolean);

const toCertification = (
	raw: Extract<RawSectionItem, { __typename: 'Certification' }>
): Certification => ({
	id: raw.slug ?? raw.sys.id,
	name: raw.name,
	provider: raw.provider,
	logo: raw.providerLogo?.url ? httpsUrl(raw.providerLogo.url) : '',
	certificateUrl: raw.certificateUrl ?? undefined,
	issuedDate: raw.issuedOn,
	expiryDate: raw.expiresOn ?? undefined,
	credentialId: raw.credentialId ?? undefined,
	highlight: raw.highlight ?? false,
});

const toTestimonial = (
	raw: Extract<RawSectionItem, { __typename: 'TestimonialCard' }>
): Testimonial => ({
	id: raw.sys.id,
	review: raw.review,
	reviewer: raw.reviewer,
	role: raw.authorRole ?? '',
	organisation: raw.organisation ?? '',
	avatar: { url: raw.avatar?.url ?? '' },
});

const toCollaborator = (raw: RawLink): Collaborator | null => {
	if (!raw.logo?.url) return null;
	const width = raw.logo.width ?? 1;
	const height = raw.logo.height ?? 1;
	return {
		name: raw.label,
		url: raw.url,
		logoUrl: httpsUrl(raw.logo.url),
		ratio: `${width} / ${height}`,
		tall: width / height < 1,
	};
};

const WORD_TOKEN = '{word}';

const toManifesto = (
	section: RawHomeSection | undefined
): Manifesto | undefined => {
	const statement = section?.heading ?? '';
	const at = statement.indexOf(WORD_TOKEN);
	const words = compact(section?.words)
		.map((word) => word.trim())
		.filter(Boolean);
	if (at === -1 || words.length < 2) return undefined;
	return {
		before: statement.slice(0, at),
		after: statement.slice(at + WORD_TOKEN.length),
		words,
	};
};

export const loadHome = cache(async (): Promise<HomeContent> => {
	const { data } = await runQuery<HomeResponse>(GET_HOME);
	const sections = compact(
		data.pageCollection.items[0]?.sectionCollection?.items
	).filter((section) => section.key);
	const byKey = (key: HomeSectionKey) =>
		sections.find((section) => section.key === key);

	const hero = byKey('hero');
	const about = byKey('about');
	const capabilities = byKey('capabilities');
	const career = byKey('career');
	const certifications = byKey('certifications');
	const collaborations = byKey('collaborations');
	const testimonials = byKey('testimonials');
	const work = byKey('work');

	return {
		order: sections.map((section) => section.key as HomeSectionKey),
		hero: {
			pitch: hero?.body?.json,
			ctas: compact(hero?.ctasCollection?.items).map(toLink),
		},
		manifesto: toManifesto(byKey('manifesto')),
		work: {
			...heading(work),
			projects: itemsOf(work, 'PortfolioDetails').map(toPortfolioItem),
		},
		about: {
			...heading(about),
			bio: paragraphs(about?.body?.json),
			portrait: about?.image?.url
				? { url: about.image.url, alt: about.image.description ?? '' }
				: undefined,
			principles: itemsOf(about, 'Principle').map(({ title, body }) => ({
				title,
				body,
			})),
			stats: compact(about?.statsCollection?.items).map((stat) => ({
				value: stat.value,
				suffix: stat.suffix ?? undefined,
				label: stat.label,
				compact: stat.isCompact ?? false,
			})),
		},
		capabilities: {
			...heading(capabilities),
			items: itemsOf(capabilities, 'Capability').map((item) => ({
				title: item.title,
				summary: item.summary ?? '',
				items: item.items ?? [],
			})),
		},
		career: {
			...heading(career),
			experiences: sortByStart(
				itemsOf(career, 'CareerExperience').map(toExperience)
			),
		},
		certifications: {
			...heading(certifications),
			items: itemsOf(certifications, 'Certification').map(toCertification),
		},
		collaborations: {
			...heading(collaborations),
			items: compact(itemsOf(collaborations, 'Link').map(toCollaborator)),
		},
		testimonials: {
			...heading(testimonials),
			items: itemsOf(testimonials, 'TestimonialCard').map(toTestimonial),
		},
	};
});

// ── Blog ───────────────────────────────────────────────────────────────────

export const convertContentfulBlogPost = (post: BlogPostItem): BlogPost => ({
	id: post.sys.id,
	title: post.title,
	slug: post.slug,
	excerpt: post.excerpt,
	content: post.content || { json: {} as Document },
	featuredImage: post.featuredImage ?? { url: '', title: '', description: '' },
	category: post.blogCategory?.name ?? '',
	tags: post.tags ?? [],
	authorName: post.author?.name ?? '',
	authorAvatar: {
		url: post.author?.avatar?.url ?? '',
		title: post.author?.avatar?.title ?? '',
		description: post.author?.avatar?.description ?? '',
	},
	publishedAt: post.publishedDate,
	updatedAt: post.updatedDate || post.publishedDate,
	readTime: post.readTime,
	publishedDate: post.publishedDate,
	updatedDate: post.updatedDate || post.publishedDate,
	seoTitle: post.seo?.title ?? '',
	seoDescription: post.seo?.description ?? '',
});

/** Drafts read in preview mode can be half-written; skip undated ones. */
const isDated = (post: BlogPostItem): boolean => Boolean(post.publishedDate);

export const loadBlogPosts = async (
	limit = 10,
	skip = 0
): Promise<QueryResult<BlogPostsResponse>> => {
	const { data } = await runQuery<BlogPostsResponse>(GET_ALL_BLOG_POSTS, {
		limit,
		skip,
	});
	const items = data.blogPostCollection.items.filter(isDated);
	return {
		data: { blogPostCollection: { ...data.blogPostCollection, items } },
	};
};

export const loadBlogPostBySlug = async (
	slug: string
): Promise<QueryResult<BlogPostBySlugResponse>> => {
	const { data } = await runQuery<BlogPostBySlugResponse>(
		GET_BLOG_POST_BY_SLUG,
		{ slug }
	);
	const items = data.blogPostCollection.items.filter(isDated);
	return { data: { blogPostCollection: { items } } };
};
