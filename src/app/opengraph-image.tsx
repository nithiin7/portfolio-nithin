import type { ImageResponse } from 'next/og';

import { loadSiteSettings } from 'helpers/contentful';
import { ogContentType, ogSize, renderOgCard } from 'helpers/og';

export const alt = 'Portfolio social card';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image(): Promise<ImageResponse> {
	const site = await loadSiteSettings();
	return renderOgCard({
		kicker: 'PORTFOLIO',
		eyebrow: 'Selected works & writing',
		title: site.name,
		meta: `${site.role.toUpperCase()} @ ${site.company}`,
	});
}
