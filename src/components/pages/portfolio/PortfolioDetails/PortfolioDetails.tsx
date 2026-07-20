'use client';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ViewTransition } from 'react';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';

import { PortfolioGallery } from 'components/pages';
import { PortfolioAnimations } from 'components/utilities';

import styles from './PortfolioDetails.module.scss';

interface PortfolioDetailsProps {
	project: {
		id: number;
		title: string;
		year?: string;
		spotlightImage?: { url: string };
		description: { json: Document };
		demo?: string;
		github?: string;
		galleryCollection?: {
			items: { url: string; description: string }[];
		};
		tech?: string[];
		features: string[];
	};
}

export default function PortfolioDetails({ project }: PortfolioDetailsProps) {
	const router = useRouter();

	return (
		<div className={styles.PortfolioDetailsPage}>
			<PortfolioAnimations animation="slideUp" delay={0.05}>
				<div className={styles.PortfolioDetailsPage__header}>
					<button
						type="button"
						onClick={() => router.push('/#portfolio', { scroll: false })}
						className={styles.PortfolioDetailsPage__backButton}
					>
						<FiArrowLeft size={16} />
						<span>Back to Portfolio</span>
					</button>
					<div className={styles.PortfolioDetailsPage__projectNumber}>
						{String(project.id).padStart(2, '0')}
					</div>
				</div>
			</PortfolioAnimations>

			<div className={styles.PortfolioDetailsPage__content}>
				<div className={styles.PortfolioDetailsPage__mainSection}>
					<div className={styles.PortfolioDetailsPage__projectHeader}>
						<ViewTransition
							name={`portfolio-title-${project.id}`}
							share="portfolio-title-morph"
							enter="none"
							exit="none"
							update="none"
						>
							<h1 className={styles.PortfolioDetailsPage__projectTitle}>
								{project.title}
							</h1>
						</ViewTransition>
						{project.year && (
							<p className={styles.PortfolioDetailsPage__projectYear}>
								{project.year}
							</p>
						)}
					</div>

					{project.spotlightImage?.url && (
						<ViewTransition
							name={`portfolio-image-${project.id}`}
							share="portfolio-image-morph"
							enter="none"
							exit="none"
							update="none"
						>
							<div className={styles.PortfolioDetailsPage__projectImage}>
								<Image
									src={project.spotlightImage.url}
									alt={project.title}
									width={1200}
									height={675}
									priority
									sizes="(min-width: 1024px) 70vw, 100vw"
								/>
							</div>
						</ViewTransition>
					)}

					<PortfolioAnimations animation="slideUp" delay={0.2}>
						<div className={styles.PortfolioDetailsPage__projectDescription}>
							{documentToReactComponents(project.description.json)}
						</div>
					</PortfolioAnimations>

					{(project.demo || project.github) && (
						<PortfolioAnimations animation="slideUp" delay={0.25}>
							<div className={styles.PortfolioDetailsPage__projectLinks}>
								{project.demo && (
									<a
										href={project.demo}
										target="_blank"
										rel="noopener noreferrer"
										className={styles.PortfolioDetailsPage__projectLink}
									>
										<FiExternalLink size={16} />
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
										<FiGithub size={16} />
										<span>View Code</span>
									</a>
								)}
							</div>
						</PortfolioAnimations>
					)}

					{project.galleryCollection &&
						project.galleryCollection.items.length > 0 && (
							<PortfolioAnimations animation="slideUp" delay={0.3}>
								<PortfolioGallery
									images={project.galleryCollection.items.map((item) => ({
										id: item.url,
										url: item.url,
										alt: item.description,
									}))}
									title="Project Gallery"
								/>
							</PortfolioAnimations>
						)}
				</div>

				<div className={styles.PortfolioDetailsPage__sidebar}>
					<PortfolioAnimations animation="slideUp" delay={0.2}>
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
					</PortfolioAnimations>

					<PortfolioAnimations animation="slideUp" delay={0.25}>
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
					</PortfolioAnimations>
				</div>
			</div>
		</div>
	);
}
