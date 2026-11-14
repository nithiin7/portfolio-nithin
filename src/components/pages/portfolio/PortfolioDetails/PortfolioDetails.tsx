import {
	documentToReactComponents,
	type Options,
} from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, type Document } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';
import type { FC, ReactElement } from 'react';

import RevealImage from 'components/motion/RevealImage/RevealImage';
import RevealText from 'components/motion/RevealText/RevealText';
import CaseStudyProgress from 'components/pages/portfolio/CaseStudyProgress/CaseStudyProgress';
import PortfolioGallery from 'components/pages/portfolio/PortfolioGallery/PortfolioGallery';
import PortfolioNext from 'components/pages/portfolio/PortfolioNext/PortfolioNext';
import ThemedImage from 'components/utilities/ThemedImage/ThemedImage';
import { EXTERNAL_ARROW } from 'constants/index';
import { buildCaseStudy } from 'helpers/caseStudy';
import type {
	CaseStudyAsset,
	CaseStudyNext,
	CaseStudySection,
} from 'types/caseStudy';
import type { RawProject as PortfolioDetailsData } from 'types/contentful';

import styles from './PortfolioDetails.module.scss';

interface PortfolioDetailsProps {
	project: PortfolioDetailsData;
	position?: { position: number; total: number } | null;
	next?: CaseStudyNext;
}

const pad = (n: number): string => String(n).padStart(2, '0');

const absolute = (url: string): string =>
	url.startsWith('//') ? `https:${url}` : url;

const richTextOptions = (assets: Map<string, CaseStudyAsset>): Options => ({
	renderNode: {
		[BLOCKS.HEADING_2]: (_, children) => <h3>{children}</h3>,
		[BLOCKS.HEADING_3]: (_, children) => <h4>{children}</h4>,
		[INLINES.HYPERLINK]: (node, children) => (
			<a href={node.data.uri} target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		),
		[BLOCKS.EMBEDDED_ASSET]: (node) => {
			const asset = assets.get(node.data?.target?.sys?.id);
			if (!asset?.contentType?.startsWith('image/')) return null;
			return (
				<figure className={styles.CaseStudy__figure}>
					<Image
						src={absolute(asset.url)}
						alt={asset.description || asset.title || ''}
						width={asset.width ?? 1600}
						height={asset.height ?? 900}
						sizes="(min-width: 1024px) 66vw, 100vw"
					/>
					{asset.title && <figcaption>{asset.title}</figcaption>}
				</figure>
			);
		},
	},
});

interface SectionBodyProps {
	section: CaseStudySection;
	project: PortfolioDetailsData;
	render: (doc: Document) => ReactElement | ReactElement[] | null;
}

const SectionBody: FC<SectionBodyProps> = ({
	section,
	project,
	render,
}): ReactElement => (
	<>
		{section.metrics && (
			<dl className={styles.CaseStudy__metrics}>
				{section.metrics.map((metric) => (
					<div key={metric.label} className={styles.CaseStudy__metric}>
						<dt>{metric.label}</dt>
						<dd>{metric.value}</dd>
					</div>
				))}
			</dl>
		)}

		{section.body && (
			<div className={styles.CaseStudy__prose}>{render(section.body)}</div>
		)}

		{section.diagram && (
			<figure className={styles.CaseStudy__diagram}>
				<RevealImage className={styles.CaseStudy__diagramFrame}>
					<Image
						src={absolute(section.diagram.url)}
						alt={
							section.diagram.description ||
							section.diagram.title ||
							`${project.title} architecture diagram`
						}
						width={section.diagram.width ?? 1600}
						height={section.diagram.height ?? 900}
						sizes="(min-width: 1024px) 66vw, 100vw"
					/>
				</RevealImage>
				{section.diagram.title && (
					<figcaption className={styles.CaseStudy__caption}>
						{section.diagram.title}
					</figcaption>
				)}
			</figure>
		)}

		{section.highlights && (
			<ol className={styles.CaseStudy__highlights}>
				{section.highlights.map((item, i) => (
					<li key={`${item.title ?? item.body}-${i}`}>
						<span className={styles.CaseStudy__index} aria-hidden="true">
							{pad(i + 1)}
						</span>
						<p>
							{item.title && <strong>{item.title}. </strong>}
							{item.body}
						</p>
					</li>
				))}
			</ol>
		)}

		{section.key === 'gallery' && (
			<PortfolioGallery
				projectTitle={project.title}
				images={(project.galleryCollection?.items ?? [])
					.filter((item) => item != null)
					.map((item, i) => ({
						// Contentful galleries can repeat an asset
						id: `${i}-${item.url}`,
						url: item.url,
						alt: item.description ?? '',
					}))}
			/>
		)}
	</>
);

const PortfolioDetails: FC<PortfolioDetailsProps> = ({
	project,
	position,
	next,
}): ReactElement => {
	const assets = new Map(
		(project.description?.links?.assets?.block ?? []).map((asset) => [
			asset.sys.id,
			asset,
		])
	);
	const sections = buildCaseStudy({
		description: project.description,
		features: project.features,
		assets,
		hasGallery: (project.galleryCollection?.items?.length ?? 0) > 0,
	});
	const options = richTextOptions(assets);
	const render = (doc: Document) =>
		documentToReactComponents(doc, options) as ReactElement;

	const links = [
		project.demo && { href: project.demo, label: 'Live site' },
		project.github && { href: project.github, label: 'Source' },
	].filter((link): link is { href: string; label: string } => Boolean(link));

	return (
		<article className={styles.CaseStudy}>
			<header className={styles.CaseStudy__hero}>
				<div className={styles.CaseStudy__topline}>
					<Link
						href="/#portfolio"
						scroll={false}
						className={styles.CaseStudy__back}
					>
						<span aria-hidden="true">←</span> All works
					</Link>
					{position && (
						<p className={styles.CaseStudy__kicker}>
							Case study{' '}
							<span className={styles.CaseStudy__tabular}>
								{pad(position.position)}/{pad(position.total)}
							</span>
						</p>
					)}
				</div>

				<h1 className={styles.CaseStudy__title}>{project.title}</h1>

				{project.shortDescription && (
					<RevealText
						as="p"
						trigger="mount"
						delay={0.2}
						className={styles.CaseStudy__lede}
					>
						{project.shortDescription}
					</RevealText>
				)}

				<dl className={styles.CaseStudy__meta}>
					{project.role && (
						<div className={styles.CaseStudy__metaItem}>
							<dt>Role</dt>
							<dd>{project.role}</dd>
						</div>
					)}
					{project.year && (
						<div className={styles.CaseStudy__metaItem}>
							<dt>Year</dt>
							<dd>{project.year}</dd>
						</div>
					)}
					{(project.tech?.length ?? 0) > 0 && (
						<div
							className={styles.CaseStudy__metaItem}
							data-wide={!project.role || undefined}
						>
							<dt>Stack</dt>
							<dd>{project.tech?.join(', ')}</dd>
						</div>
					)}
					{links.length > 0 && (
						<div className={styles.CaseStudy__metaItem}>
							<dt>Links</dt>
							<dd>
								<ul className={styles.CaseStudy__links}>
									{links.map((link) => (
										<li key={link.label}>
											<a
												href={link.href}
												target="_blank"
												rel="noopener noreferrer"
												className={styles.CaseStudy__link}
											>
												{link.label}
												<span aria-hidden="true"> {EXTERNAL_ARROW}</span>
												<span className={styles.CaseStudy__sr}>
													{' '}
													(opens in a new tab)
												</span>
											</a>
										</li>
									))}
								</ul>
							</dd>
						</div>
					)}
				</dl>
			</header>

			{project.spotlightImage?.url && (
				// Not wrapped in RevealImage: a clipped cover at capture would blank the morph in from the works list
				<div className={styles.CaseStudy__cover}>
					<ThemedImage
						src={project.spotlightImage.url}
						srcDark={project.spotlightImageDark?.url}
						alt=""
						fill
						priority
						fetchPriority="high"
						sizes="100vw"
					/>
				</div>
			)}

			{sections.length > 0 && (
				<CaseStudyProgress
					sections={sections.map(({ key, label }) => ({ id: key, label }))}
				>
					{sections.map((section, i) => (
						<section
							key={section.key}
							id={section.key}
							tabIndex={-1}
							className={styles.CaseStudy__section}
							data-section={section.key}
						>
							<header className={styles.CaseStudy__sectionHead}>
								<span className={styles.CaseStudy__index} aria-hidden="true">
									{pad(i + 1)} —
								</span>
								<RevealText as="h2" className={styles.CaseStudy__heading}>
									{section.label}
								</RevealText>
							</header>
							<SectionBody
								section={section}
								project={project}
								render={render}
							/>
						</section>
					))}
				</CaseStudyProgress>
			)}

			{next && <PortfolioNext next={next} />}
		</article>
	);
};

export default PortfolioDetails;
