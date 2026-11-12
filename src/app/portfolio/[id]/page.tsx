import { BLOCKS } from '@contentful/rich-text-types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PortfolioDetails from 'components/pages/portfolio/PortfolioDetails/PortfolioDetails';
import { absoluteUrl, siteConfig } from 'config/site';
import { nextInOrder, positionOf } from 'helpers/caseStudy';
import {
	loadAllPortfolioIds,
	loadPortfolioData,
	loadWorksOrder,
} from 'helpers/contentful';
import { fetchBlurDataURL } from 'helpers/portfolio';
import { plainText } from 'helpers/richText';
import type { CaseStudyNext } from 'types/caseStudy';
import type { PortfolioDetails as Project } from 'types/contentful';

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

const DESCRIPTION_MAX = 155;

// shortDescription is often empty in Contentful; fall back to the case study's first paragraph
const projectDescription = (project: Project): string => {
	const firstParagraph = project.description?.json?.content.find(
		(node) => node.nodeType === BLOCKS.PARAGRAPH
	);
	const source =
		project.shortDescription?.trim() ||
		(firstParagraph ? plainText(firstParagraph) : '');
	const text = source.replace(/\s+/g, ' ').trim();
	if (!text) return `${project.title} — a case study by ${siteConfig.name}.`;
	return text.length > DESCRIPTION_MAX
		? `${text.slice(0, DESCRIPTION_MAX - 1).trimEnd()}…`
		: text;
};

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
	const description = projectDescription(project);

	return {
		title: project.title,
		description,
		openGraph: {
			type: 'article',
			locale: 'en_US',
			url,
			title: project.title,
			description,
			siteName: siteConfig.siteName,
		},
		twitter: {
			card: 'summary_large_image',
			title: project.title,
			description,
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
	const nextImageDark = following?.item.imageDark?.url || undefined;
	const next: CaseStudyNext | undefined = following
		? {
				id: following.item.id as number,
				title: following.item.title,
				image: nextImage,
				imageDark: nextImageDark,
				blurDataURL: nextImage ? await fetchBlurDataURL(nextImage) : undefined,
				blurDataURLDark: nextImageDark
					? await fetchBlurDataURL(nextImageDark)
					: undefined,
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
