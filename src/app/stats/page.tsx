import type { Metadata } from 'next';
import Script from 'next/script';

import { Stats } from 'components/pages';
import { loadBlogStats } from 'helpers/blogStats';
import { loadDevToStats } from 'helpers/devto';
import { loadGithubStats } from 'helpers/github';
import { loadHuggingFaceStats } from 'helpers/huggingface';
import { loadWakaTimeStats } from 'helpers/wakatime';

export const revalidate = 3600;

const title = 'Live Stats | Nithin Pradeep';
const description =
	'A real-time look at what Nithin Pradeep is building, coding, and writing — pulled live from GitHub, WakaTime, Dev.to, and more.';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title,
		description,
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url: 'https://portfolio-nithin.vercel.app/stats',
			title,
			description,
			siteName: 'Nithin Pradeep - Portfolio',
			images: [
				{
					url: '/opengraph-image.jpeg',
					width: 1200,
					height: 630,
					alt: 'Live Stats - Nithin Pradeep',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			creator: '@nithiin7',
			images: ['/opengraph-image.jpeg'],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		alternates: {
			canonical: 'https://portfolio-nithin.vercel.app/stats',
		},
	};
}

const statsStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'ProfilePage',
	name: title,
	description,
	url: 'https://portfolio-nithin.vercel.app/stats',
	mainEntity: {
		'@type': 'Person',
		name: 'Nithin Pradeep',
		jobTitle: 'Full Stack Developer',
		url: 'https://portfolio-nithin.vercel.app/',
	},
};

export default async function StatsPage(): Promise<React.ReactElement> {
	const [github, wakatime, devto, huggingface, blog] = await Promise.all([
		loadGithubStats(),
		loadWakaTimeStats(),
		loadDevToStats(),
		loadHuggingFaceStats(),
		loadBlogStats(),
	]);

	return (
		<>
			<Script
				id="stats-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(statsStructuredData),
				}}
			/>
			<Stats
				github={github}
				wakatime={wakatime}
				devto={devto}
				huggingface={huggingface}
				blog={blog}
			/>
		</>
	);
}
