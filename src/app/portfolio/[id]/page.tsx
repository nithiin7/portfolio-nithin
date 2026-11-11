import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PortfolioDetails } from 'components/pages';
import { absoluteUrl, siteConfig } from 'config/site';
import { nextInOrder, positionOf } from 'helpers/caseStudy';
import {
	loadAllPortfolioIds,
	loadPortfolioData,
	loadWorksOrder,
} from 'helpers/contentful';
import { fetchBlurDataURL } from 'helpers/portfolio';
import type { CaseStudyNext } from 'types/caseStudy';

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

	const url = absoluteUrl(`/portfolio/${id}`);

	return {
		title: project.title,
		description: project.shortDescription,
		openGraph: {
			type: 'article',
			locale: 'en_US',
			url,
			title: project.title,
			description: project.shortDescription,
			siteName: siteConfig.siteName,
		},
		twitter: {
			card: 'summary_large_image',
			title: project.title,
			description: project.shortDescription,
			creator: siteConfig.twitterHandle,
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
			canonical: url,
		},
	};
}

export default async function PortfolioDetailsPage({
	params,
}: PortfolioDetailsPageProps) {
	const { id } = await params;
	const [data, order] = await Promise.all([
		loadPortfolioData(id),
		loadWorksOrder(),
	]);
	const project = data.data.portfolioDetailsCollection.items[0];

	if (!project) {
		notFound();
	}

	const following = nextInOrder(order, project.id);
	const nextImage = following?.item.image?.url || undefined;
	const next: CaseStudyNext | undefined = following
		? {
				id: following.item.id as number,
				title: following.item.title,
				image: nextImage,
				blurDataURL: nextImage ? await fetchBlurDataURL(nextImage) : undefined,
				position: following.position,
				total: following.total,
			}
		: undefined;

	return (
		<PortfolioDetails
			project={project}
			position={positionOf(order, project.id)}
			next={next}
		/>
	);
}
