import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';

import PortfolioGallery from 'components/pages/PortfolioGallery/PortfolioGallery';
import { loadPortfolioData } from 'helpers/contentful';

import styles from './page.module.scss';

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
		title: `${project.title} - Portfolio Details`,
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

	return (
		<div className={styles.PortfolioDetailsPage}>
			<div className={styles.PortfolioDetailsPage__header}>
				<Link href="/" className={styles.PortfolioDetailsPage__backButton}>
					<FiArrowLeft size={20} />
					<span>Back to Portfolio</span>
				</Link>
				<div className={styles.PortfolioDetailsPage__projectNumber}>
					{String(project.id).padStart(2, '0')}
				</div>
			</div>
			<div className={styles.PortfolioDetailsPage__content}>
				<div className={styles.PortfolioDetailsPage__mainSection}>
					<div className={styles.PortfolioDetailsPage__projectHeader}>
						<h1 className={styles.PortfolioDetailsPage__projectTitle}>
							{project.title}
						</h1>
						{project.year && (
							<p className={styles.PortfolioDetailsPage__projectYear}>
								{project.year}
							</p>
						)}
					</div>
					<div className={styles.PortfolioDetailsPage__projectImage}>
						<Image
							src={project.spotlightImage?.url}
							alt={project.title}
							width={1000}
							height={1000}
						/>
					</div>
					<div className={styles.PortfolioDetailsPage__projectDescription}>
						{documentToReactComponents(project.description.json)}
					</div>
					<div className={styles.PortfolioDetailsPage__projectLinks}>
						{project.demo && (
							<a
								href={project.demo}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.PortfolioDetailsPage__projectLink}
							>
								<FiExternalLink size={20} />
								<span>Live Demo</span>
							</a>
						)}
						{project.github && (
							<a
								href={project.github}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.PortfolioDetailsPage__projectLink}
							>
								<FiGithub size={20} />
								<span>View Code</span>
							</a>
						)}
					</div>
					{project.galleryCollection &&
						project.galleryCollection.items.length > 0 && (
							<PortfolioGallery
								images={project.galleryCollection.items.map((item) => ({
									id: item.url,
									url: item.url,
									alt: item.description,
								}))}
								title="Project Gallery"
							/>
						)}
				</div>
				<div className={styles.PortfolioDetailsPage__sidebar}>
					<div className={styles.PortfolioDetailsPage__techSection}>
						<h3 className={styles.PortfolioDetailsPage__sectionTitle}>
							Technologies
						</h3>
						<div className={styles.PortfolioDetailsPage__techTags}>
							{project.tech?.map((tech, index) => (
								<span
									key={index}
									className={styles.PortfolioDetailsPage__techTag}
								>
									{tech}
								</span>
							))}
						</div>
					</div>
					<div className={styles.PortfolioDetailsPage__featuresSection}>
						<h3 className={styles.PortfolioDetailsPage__sectionTitle}>
							Key Features
						</h3>
						<ul className={styles.PortfolioDetailsPage__featuresList}>
							{project.features.map((feature, index) => (
								<li
									key={index}
									className={styles.PortfolioDetailsPage__featureItem}
								>
									{feature}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
