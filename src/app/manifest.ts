import type { MetadataRoute } from 'next';

import { siteName } from 'config/site';
import { loadSiteSettings } from 'helpers/contentful';
import { palette } from 'styles/tokens';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
	const site = await loadSiteSettings();
	return {
		name: siteName(site),
		short_name: site.name,
		start_url: '/',
		description: site.seo.description,
		display: 'standalone',
		background_color: palette.ink,
		theme_color: palette.ink,
		icons: [
			{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
			{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
			{
				src: '/icons/icon-maskable-512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	};
}
