import { BLOCKS } from '@contentful/rich-text-types';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import PortfolioDetails from 'components/pages/portfolio/PortfolioDetails/PortfolioDetails';
import { absoluteUrl, siteName } from 'config/site';
import { nextInOrder, positionOf } from 'helpers/caseStudy';
import {
	loadProject,
	loadProjectSlugByLegacyId,
	loadSiteSettings,
	loadWork,
} from 'helpers/contentful';
import { fetchBlurDataURL } from 'helpers/portfolio';
import { plainText } from 'helpers/richText';
import type { CaseStudyNext } from 'types/caseStudy';
import type { RawProject } from 'types/contentful';

export const revalidate = 3600;

export async function generateStaticParams() {
	const work = await loadWork();
	return work.map(({ slug }) => ({ slug }));
}

interface PortfolioDetailsPageProps {
	params: Promise<{ slug: string }>;
}

const DESCRIPTION_MAX = 155;

const redirectLegacyId = async (slug: string): Promise<void> => {
	if (!/^\d+$/.test(slug)) return;
	const target = await loadProjectSlugByLegacyId(Number(slug));
	if (target) permanentRedirect(`/portfolio/${target}`);
};

const projectDescription = (project: RawProject, author: string): string => {
	const firstParagraph = project.description?.json?.content.find(
		(node) => node.nodeType === BLOCKS.PARAGRAPH
	);
	const source =
		project.seo?.description?.trim() ||
		project.shortDescription?.trim() ||
		(firstParagraph ? plainText(firstParagraph) : '');
	const text = source.replace(/\s+/g, ' ').trim();
	if (!text) return `${project.title}, a case study by ${author}.`;
	return text.length > DESCRIPTION_MAX
		? `${text.slice(0, DESCRIPTION_MAX - 1).trimEnd()}…`
		: text;
};

export async function generateMetadata({
	params,
}: PortfolioDetailsPageProps): Promise<Metadata> {
	const { slug } = await params;
	const [project, site] = await Promise.all([
		loadProject(slug),
		loadSiteSettings(),
	]);

	if (!project) return { title: 'Project not found' };

	const url = absoluteUrl(`/portfolio/${project.slug}`);
	const title = project.seo?.title ?? project.title;
	const description = projectDescription(project, site.name);

	return {
		title,
		description,
		openGraph: {
			type: 'article',
			locale: 'en_US',
			url,
			title,
			description,
			siteName: siteName(site),
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			creator: site.twitterHandle,
		},
		robots: project.seo?.noIndex
			? { index: false, follow: true }
			: {
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
		alternates: { canonical: url },
	};
}

export default async function PortfolioDetailsPage({
	params,
}: PortfolioDetailsPageProps) {
	const { slug } = await params;
	await redirectLegacyId(slug);
	const [project, order] = await Promise.all([loadProject(slug), loadWork()]);

	if (!project || project.id == null) notFound();

	const following = nextInOrder(order, project.id);
	const nextImage = following?.item.image?.url || undefined;
	const nextImageDark = following?.item.imageDark?.url || undefined;
	const next: CaseStudyNext | undefined = following
		? {
				id: following.item.id as number,
				slug: following.item.slug,
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
