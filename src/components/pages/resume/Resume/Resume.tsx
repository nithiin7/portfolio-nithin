'use client';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
import type { FC } from 'react';
import { FiDownload, FiMail } from 'react-icons/fi';

import { CareerCard } from 'components/pages';
import CertificationBadge from 'components/pages/homepage/CertificationBadge/CertificationBadge';
import {
	ColorMaskButton,
	PortfolioAnimations,
	Tag,
} from 'components/utilities';
import { contactOptions, socials } from 'constants/index';
import type { Experience } from 'types/career';
import type { Certification } from 'types/certification';
import type { ServiceHeader, ServiceItem } from 'types/service';

import styles from './Resume.module.scss';

interface ResumeHeaderData {
	items: {
		title?: string;
		subTitle?: string;
		descriptionShort?: string;
	}[];
}

interface ResumeAboutData {
	items: {
		title?: string;
		image?: { url: string };
		descriptionLong?: { json: Document };
	}[];
}

interface ResumeProps {
	className?: string;
	header?: ResumeHeaderData;
	about?: ResumeAboutData;
	services?: { data: ServiceHeader; services: ServiceItem[] };
	career: {
		data: { title?: string; subtitle?: string };
		experiences: Experience[];
	};
	certifications?: {
		data: { title?: string; subtitle?: string };
		certifications: Certification[];
	};
	resumeUrl: string;
}

/**
 * Resume renders the same career content as the downloadable PDF, but as
 * crawlable, deep-linkable HTML — the PDF stays available as a secondary
 * download action rather than the only way to see this content.
 *
 * @component
 */
const Resume: FC<ResumeProps> = ({
	className = '',
	header = { items: [] },
	about = { items: [] },
	services = { data: { title: '', subTitle: '' }, services: [] },
	career,
	certifications = { data: {}, certifications: [] },
	resumeUrl,
}) => {
	const role = [header.items[0]?.title, header.items[0]?.subTitle]
		.filter(Boolean)
		.join(' ');
	const tagline = header.items[1]?.descriptionShort;
	const summary = about.items[2]?.descriptionLong?.json;

	const sortedExperiences = [...career.experiences].sort(
		(a, b) => parseInt(b.year, 10) - parseInt(a.year, 10)
	);

	const skillGroups = services.services
		.filter((item) => item.__typename === 'Section')
		.map((item) => ({
			heading: item.contentsCollection.items[0]?.title,
			skills: item.contentsCollection.items[1]?.list ?? [],
		}))
		.filter((group) => group.skills.length > 0);

	const openCertificate = (certification: Certification) => {
		if (certification.certificateUrl) {
			window.open(
				certification.certificateUrl,
				'_blank',
				'noopener,noreferrer'
			);
		}
	};

	return (
		<div className={`${styles.Resume} ${className}`}>
			<PortfolioAnimations animation="slideUp">
				<header className={styles.Resume__header} id="resume-header">
					<h1 className={styles.Resume__name}>Nithin Pradeep</h1>
					{role && <p className={styles.Resume__role}>{role}</p>}
					{tagline && <p className={styles.Resume__tagline}>{tagline}</p>}

					<div className={styles.Resume__contactRow}>
						{contactOptions.map((option) => (
							<a
								key={option.link}
								className={styles.Resume__contactLink}
								href={option.link}
								target={
									option.link.startsWith('mailto:') ? undefined : '_blank'
								}
								rel="noopener noreferrer"
							>
								{option.subtitle}
							</a>
						))}
						{socials.map((social) => (
							<a
								key={social.title}
								className={styles.Resume__contactLink}
								href={social.link}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={social.title}
							>
								{social.icon}
							</a>
						))}
					</div>

					<div className={styles.Resume__actions}>
						<ColorMaskButton text="Get in Touch" href="/contact" />
						<a
							className={styles.Resume__downloadLink}
							href={resumeUrl}
							download="Nithin_Resume.pdf"
						>
							<FiDownload size={16} />
							<span>Download PDF</span>
						</a>
					</div>
				</header>
			</PortfolioAnimations>

			{summary && (
				<PortfolioAnimations animation="slideUp" delay={0.05}>
					<section className={styles.Resume__section} id="resume-summary">
						<h2 className={styles.Resume__sectionTitle}>Summary</h2>
						<div className={styles.Resume__summary}>
							{documentToReactComponents(summary)}
						</div>
					</section>
				</PortfolioAnimations>
			)}

			{skillGroups.length > 0 && (
				<PortfolioAnimations animation="slideUp" delay={0.1}>
					<section className={styles.Resume__section} id="resume-skills">
						<h2 className={styles.Resume__sectionTitle}>Skills</h2>
						{skillGroups.map((group) => (
							<div key={group.heading} className={styles.Resume__skillsGroup}>
								{group.heading && (
									<h3 className={styles.Resume__skillsHeading}>
										{group.heading}
									</h3>
								)}
								<div className={styles.Resume__skillsList}>
									{group.skills.map((skill) => (
										<Tag
											key={skill}
											variant="secondary"
											size="small"
											animated={false}
										>
											{skill}
										</Tag>
									))}
								</div>
							</div>
						))}
					</section>
				</PortfolioAnimations>
			)}

			{sortedExperiences.length > 0 && (
				<PortfolioAnimations animation="slideUp" delay={0.15}>
					<section className={styles.Resume__section} id="resume-experience">
						<h2 className={styles.Resume__sectionTitle}>Experience</h2>
						<div className={styles.Resume__experienceList}>
							{sortedExperiences.map((experience) => (
								<CareerCard key={experience.id} experience={experience} />
							))}
						</div>
					</section>
				</PortfolioAnimations>
			)}

			{certifications.certifications.length > 0 && (
				<PortfolioAnimations animation="slideUp" delay={0.2}>
					<section
						className={styles.Resume__section}
						id="resume-certifications"
					>
						<h2 className={styles.Resume__sectionTitle}>Certifications</h2>
						<div className={styles.Resume__certificationsGrid}>
							{certifications.certifications.map((certification, index) => (
								<CertificationBadge
									key={`${certification.id ?? certification.name}-${index}`}
									certification={certification}
									onClick={() => openCertificate(certification)}
								/>
							))}
						</div>
					</section>
				</PortfolioAnimations>
			)}

			<PortfolioAnimations animation="slideUp" delay={0.25}>
				<footer className={styles.Resume__footer}>
					<a className={styles.Resume__footerLink} href="/contact">
						<FiMail size={16} />
						<span>Let&apos;s work together</span>
					</a>
				</footer>
			</PortfolioAnimations>
		</div>
	);
};

export default Resume;
