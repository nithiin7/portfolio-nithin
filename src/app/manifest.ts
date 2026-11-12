import type { MetadataRoute } from 'next';

import { siteConfig } from 'config/site';
import { palette } from 'styles/tokens';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteConfig.siteName,
		short_name: siteConfig.shortName,
		start_url: '/',
		description: siteConfig.description,
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
