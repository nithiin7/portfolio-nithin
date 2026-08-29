import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Nithin Pradeep - Portfolio',
		short_name: 'Nithin Pradeep',
		start_url: '/',
		display: 'standalone',
		background_color: '#393632',
		theme_color: '#393632',
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
