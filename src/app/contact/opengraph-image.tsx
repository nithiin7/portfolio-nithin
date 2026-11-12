import type { ImageResponse } from 'next/og';

import { siteConfig } from 'config/site';
import { ogContentType, ogSize, renderOgCard } from 'helpers/og';

export const alt = `Contact — ${siteConfig.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image(): Promise<ImageResponse> {
	return renderOgCard({
		kicker: '/CONTACT',
		eyebrow: 'Get in touch',
		title: 'Let’s build something.',
		meta: `${siteConfig.availability.label.toUpperCase()}`,
	});
}
