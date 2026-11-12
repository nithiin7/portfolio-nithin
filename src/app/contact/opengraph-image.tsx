import type { ImageResponse } from 'next/og';

import { loadSiteSettings } from 'helpers/contentful';
import { ogContentType, ogSize, renderOgCard } from 'helpers/og';

export const alt = 'Contact social card';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image(): Promise<ImageResponse> {
	const site = await loadSiteSettings();
	return renderOgCard({
		kicker: '/CONTACT',
		eyebrow: 'Get in touch',
		title: 'Let’s build something.',
		meta: site.availability.label.toUpperCase(),
	});
}
