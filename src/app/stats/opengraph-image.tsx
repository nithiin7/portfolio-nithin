import type { ImageResponse } from 'next/og';

import { ogContentType, ogSize, renderOgCard } from 'helpers/og';

export const alt = 'Live stats social card';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image(): Promise<ImageResponse> {
	return renderOgCard({
		kicker: '/STATS',
		eyebrow: 'Refreshed every 30 min',
		title: 'Live stats',
		meta: 'GITHUB — WAKATIME — DEV.TO — THIS SITE',
	});
}
