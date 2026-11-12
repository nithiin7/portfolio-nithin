import type { ImageResponse } from 'next/og';

import { siteConfig } from 'config/site';
import { ogContentType, ogSize, renderOgCard } from 'helpers/og';

export const alt = `Résumé — ${siteConfig.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image(): Promise<ImageResponse> {
	return renderOgCard({
		kicker: '/RESUME',
		eyebrow: 'Résumé',
		title: siteConfig.name,
		meta: `${siteConfig.role.toUpperCase()} @ ${siteConfig.company} — ${siteConfig.location.city.toUpperCase()}`,
	});
}
