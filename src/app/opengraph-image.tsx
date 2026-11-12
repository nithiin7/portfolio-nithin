import type { ImageResponse } from 'next/og';

import { siteConfig } from 'config/site';
import { ogContentType, ogSize, renderOgCard } from 'helpers/og';

export const alt = siteConfig.title;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image(): Promise<ImageResponse> {
	return renderOgCard({
		kicker: 'PORTFOLIO',
		eyebrow: 'Selected works & writing',
		title: siteConfig.name,
		meta: `${siteConfig.role.toUpperCase()} @ ${siteConfig.company}`,
	});
}
