import type { MetadataRoute } from 'next';

import { siteConfig } from 'config/site';
import { palette } from 'styles/tokens';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteConfig.siteName,
		short_name: siteConfig.shortName,
		start_url: '/',
		display: 'standalone',
		background_color: palette.ink,
		theme_color: palette.ink,
		icons: [
			{
				src: '/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};
}
