import type { SiteSettings } from 'types/site';

const url = 'https://portfolio-nithin.vercel.app';

/**
 * Technical config only. Everything a visitor reads (name, role, socials,
 * copy) comes from Contentful Site Settings via loadSiteSettings().
 */
export const siteConfig = {
	url,
	rssUrl: `${url}/feed.xml`,
	googleSiteVerification: 'google6eac2553ee959d3e',
	ogImage: { url: '/opengraph-image', width: 1200, height: 630 },
} as const;

export const absoluteUrl = (path = '/'): string =>
	new URL(path, siteConfig.url).toString();

export const siteName = (site: Pick<SiteSettings, 'name'>): string =>
	`${site.name} — Portfolio`;

export const titleTemplate = (site: Pick<SiteSettings, 'name'>): string =>
	`%s | ${site.name}`;

export const socialUrl = (
	site: Pick<SiteSettings, 'socials'>,
	icon: NonNullable<SiteSettings['socials'][number]['icon']>
): string | undefined => site.socials.find((link) => link.icon === icon)?.url;

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
