import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PortfolioDetails } from 'components/pages';
import { loadPortfolioData, loadAllPortfolioIds } from 'helpers/contentful';

export const revalidate = 3600;

export async function generateStaticParams() {
	const ids = await loadAllPortfolioIds();
	return ids.map((id) => ({ id: String(id) }));
}

interface PortfolioDetailsPageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({
	params,
}: PortfolioDetailsPageProps): Promise<Metadata> {
	const { id } = await params;
	const data = await loadPortfolioData(id);

	const project = data.data.portfolioDetailsCollection.items[0];

	if (!project) {
		return {
			title: 'Project Not Found',
		};
	}

	return {
		title: project.title,
		description: project.shortDescription,
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url: `https://portfolio-nithin.vercel.app/portfolio/${id}`,
			title: project.title,
			description: project.shortDescription,
			siteName: 'Nithin Pradeep - Portfolio',
			images: [
				{
					url: '/opengraph-image.jpeg',
					width: 1200,
					height: 630,
					alt: project.title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: project.title,
			description: project.shortDescription,
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
			canonical: `https://portfolio-nithin.vercel.app/portfolio/${id}`,
		},
	};
}

export default async function PortfolioDetailsPage({
	params,
}: PortfolioDetailsPageProps) {
	const { id } = await params;
	const data = await loadPortfolioData(id);
	const project = data.data.portfolioDetailsCollection.items[0];

	if (!project) {
		notFound();
	}

	return <PortfolioDetails project={project} />;
}
