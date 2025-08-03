'use client';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';

import { PortfolioGallery } from 'components/pages';
import {
	PortfolioAnimations,
	StaggeredContainer,
} from 'components/utilities/PortfolioAnimations';

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
	return (
		<div className={styles.PortfolioDetailsPage}>
			<PortfolioAnimations animation="slideUp" delay={0.1}>
				<div className={styles.PortfolioDetailsPage__header}>
					<Link href="/" className={styles.PortfolioDetailsPage__backButton}>
						<FiArrowLeft size={20} />
						<span>Back to Portfolio</span>
					</Link>
					<div className={styles.PortfolioDetailsPage__projectNumber}>
						{String(project.id).padStart(2, '0')}
					</div>
				</div>
			</PortfolioAnimations>
			<div className={styles.PortfolioDetailsPage__content}>
				<div className={styles.PortfolioDetailsPage__mainSection}>
					<PortfolioAnimations animation="slideUp" delay={0.2}>
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
					</PortfolioAnimations>
					{project.spotlightImage?.url && (
						<PortfolioAnimations animation="scaleIn" delay={0.3}>
							<div className={styles.PortfolioDetailsPage__projectImage}>
								<Image
									src={project.spotlightImage.url}
									alt={project.title}
									width={1000}
									height={1000}
								/>
							</div>
						</PortfolioAnimations>
					)}
					<PortfolioAnimations animation="slideUp" delay={0.4}>
						<div className={styles.PortfolioDetailsPage__projectDescription}>
							{documentToReactComponents(project.description.json)}
						</div>
					</PortfolioAnimations>
					<PortfolioAnimations animation="slideUp" delay={0.5}>
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
					</PortfolioAnimations>
					{project.galleryCollection &&
						project.galleryCollection.items.length > 0 && (
							<PortfolioAnimations animation="slideUp" delay={0.6}>
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
					<PortfolioAnimations animation="slideInRight" delay={0.3}>
						<div className={styles.PortfolioDetailsPage__techSection}>
							<h3 className={styles.PortfolioDetailsPage__sectionTitle}>
								Technologies
							</h3>
							<StaggeredContainer staggerDelay={0.05}>
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
							</StaggeredContainer>
						</div>
					</PortfolioAnimations>
					<PortfolioAnimations animation="slideInRight" delay={0.4}>
						<div className={styles.PortfolioDetailsPage__featuresSection}>
							<h3 className={styles.PortfolioDetailsPage__sectionTitle}>
								Key Features
							</h3>
							<StaggeredContainer staggerDelay={0.1}>
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
							</StaggeredContainer>
						</div>
					</PortfolioAnimations>
				</div>
			</div>
		</div>
	);
}
