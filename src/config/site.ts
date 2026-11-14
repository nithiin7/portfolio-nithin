import type { SiteSettings } from 'types/site';

const url = 'https://portfolio-nithin.vercel.app';

/** Canonical URL, RSS feed, Search Console token and default OG image. */
export const siteConfig = {
	url,
	rssUrl: `${url}/feed.xml`,
	googleSiteVerification: 'google6eac2553ee959d3e',
	ogImage: { url: '/opengraph-image', width: 1200, height: 630 },
} as const;

/** Resolves a path against the canonical site URL. */
export const absoluteUrl = (path = '/'): string =>
	new URL(path, siteConfig.url).toString();

/** Site name shown in titles and OG metadata. */
export const siteName = (site: Pick<SiteSettings, 'name'>): string =>
	`${site.name} · Portfolio`;

/** Next.js title template that appends the owner's name. */
export const titleTemplate = (site: Pick<SiteSettings, 'name'>): string =>
	`%s | ${site.name}`;

/** URL of the social link with the given icon, if listed. */
export const socialUrl = (
	site: Pick<SiteSettings, 'socials'>,
	icon: NonNullable<SiteSettings['socials'][number]['icon']>
): string | undefined => site.socials.find((link) => link.icon === icon)?.url;

/** schema.org Person for the site owner. */
export const personJsonLd = (site: SiteSettings) =>
	({
		'@type': 'Person',
		name: site.name,
		url: absoluteUrl(),
		image: absoluteUrl(siteConfig.ogImage.url),
		jobTitle: site.role,
		worksFor: { '@type': 'Organization', name: site.company },
		address: {
			'@type': 'PostalAddress',
			addressLocality: site.location.city,
			addressRegion: site.location.region,
			addressCountry: site.location.country,
		},
		sameAs: site.socials.map((link) => link.url),
		knowsAbout: site.knowsAbout,
	}) as const;
