import type { ImageResponse } from 'next/og';

import { siteConfig } from 'config/site';
import { ogContentType, ogSize, renderOgCard } from 'helpers/og';

export const alt = `Writing — ${siteConfig.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image(): Promise<ImageResponse> {
	return renderOgCard({
		kicker: '/BLOG',
		eyebrow: 'Journal',
		title: 'Field notes on AI agents, MCP and the web',
		meta: 'ESSAYS — TUTORIALS — NOTES',
	});
}
