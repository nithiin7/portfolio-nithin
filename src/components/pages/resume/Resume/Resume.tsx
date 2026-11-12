import type { FC, ReactElement } from 'react';

import RevealText from 'components/motion/RevealText/RevealText';
import { aboutContent } from 'config/about';
import { siteConfig } from 'config/site';
import { contactOptions, socials } from 'constants/index';
import type { Experience } from 'types/career';
import type { Certification } from 'types/certification';
import type { ServiceItem } from 'types/service';

import styles from './Resume.module.scss';

interface ResumeProps {
	services?: ServiceItem[];
	experiences: Experience[];
	certifications?: Certification[];
	resumeUrl: string;
}

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * The PDF résumé as crawlable, deep-linkable HTML; the PDF stays available as
 * a download rather than the only way to read it.
 */
const Resume: FC<ResumeProps> = ({
	services = [],
	experiences,
	certifications = [],
	resumeUrl,
}): ReactElement => {
	const sortedExperiences = [...experiences].sort(
		(a, b) => parseInt(b.year, 10) - parseInt(a.year, 10)
	);

	const skillGroups = services
		.filter((item) => item.__typename === 'Section')
		.map((item) => ({
			heading: item.contentsCollection.items[0]?.title,
			skills: item.contentsCollection.items[1]?.list ?? [],
		}))
		.filter((group) => group.skills.length > 0);

	return (
		<div className={styles.Resume}>
			<header className={styles.Resume__hero}>
				<div className={styles.Resume__topline}>
					<p className={styles.Resume__mono}>Résumé</p>
					<a
						className={styles.Resume__link}
						href={resumeUrl}
						download="Nithin_Resume.pdf"
					>
						Download PDF
						<span aria-hidden="true"> ↓</span>
					</a>
				</div>
				<RevealText as="h1" trigger="mount" className={styles.Resume__name}>
					{siteConfig.name}
				</RevealText>
				<p className={styles.Resume__role}>
					{siteConfig.role}, {siteConfig.company} — {siteConfig.location.city}
				</p>
				<ul className={styles.Resume__contacts} aria-label="Contact">
					{contactOptions.map((option) => (
						<li key={option.link}>
							<a
								className={styles.Resume__link}
								href={option.link}
								{...(option.link.startsWith('mailto:')
									? {}
									: { target: '_blank', rel: 'noopener noreferrer' })}
							>
								{option.label}: {option.subtitle}
							</a>
						</li>
					))}
					{socials.map((social) => (
						<li key={social.title}>
							<a
								className={styles.Resume__link}
								href={social.link}
								target="_blank"
								rel="noopener noreferrer"
							>
								{social.title}
								<span aria-hidden="true"> ↗</span>
							</a>
						</li>
					))}
				</ul>
			</header>

			<div className={styles.Resume__inner}>
				<section
					className={styles.Resume__section}
					aria-labelledby="resume-summary"
				>
					<h2 id="resume-summary" className={styles.Resume__sectionTitle}>
						Summary
					</h2>
					<div className={styles.Resume__body}>
						{aboutContent.bio.map((paragraph) => (
							<p key={paragraph} className={styles.Resume__summary}>
								{paragraph}
							</p>
						))}
					</div>
				</section>

				{sortedExperiences.length > 0 && (
					<section
						className={styles.Resume__section}
						aria-labelledby="resume-experience"
					>
						<h2 id="resume-experience" className={styles.Resume__sectionTitle}>
							Experience
						</h2>
						<ol className={styles.Resume__body}>
							{sortedExperiences.map((experience) => (
								<li key={experience.id} className={styles.Resume__job}>
									<div className={styles.Resume__roleHead}>
										<h3 className={styles.Resume__roleTitle}>
											{experience.position}
											<span className={styles.Resume__company}>
												{' '}
												— {experience.company}
											</span>
										</h3>
										<p className={styles.Resume__mono}>
											{[experience.duration, experience.location]
												.filter(Boolean)
												.join(' · ')}
										</p>
									</div>
									<div
										className={styles.Resume__description}
										dangerouslySetInnerHTML={{ __html: experience.description }}
									/>
									{experience.technologies.length > 0 && (
										<p className={styles.Resume__mono}>
											{experience.technologies.join(' · ')}
										</p>
									)}
								</li>
							))}
						</ol>
					</section>
				)}

				{skillGroups.length > 0 && (
					<section
						className={styles.Resume__section}
						aria-labelledby="resume-skills"
					>
						<h2 id="resume-skills" className={styles.Resume__sectionTitle}>
							Skills
						</h2>
						<dl className={styles.Resume__body}>
							{skillGroups.map((group) => (
								<div key={group.heading} className={styles.Resume__skills}>
									<dt className={styles.Resume__mono}>{group.heading}</dt>
									<dd>{group.skills.join(', ')}</dd>
								</div>
							))}
						</dl>
					</section>
				)}

				{certifications.length > 0 && (
					<section
						className={styles.Resume__section}
						aria-labelledby="resume-certifications"
					>
						<h2
							id="resume-certifications"
							className={styles.Resume__sectionTitle}
						>
							Certifications
						</h2>
						<ol className={styles.Resume__body}>
							{certifications.map((certification, index) => (
								<li
									key={`${certification.id ?? certification.name}-${index}`}
									className={styles.Resume__cert}
								>
									<span className={styles.Resume__mono}>{pad(index + 1)}</span>
									{certification.certificateUrl ? (
										<a
											className={styles.Resume__certName}
											href={certification.certificateUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											{certification.name}
										</a>
									) : (
										<span className={styles.Resume__certName}>
											{certification.name}
										</span>
									)}
									<span className={styles.Resume__mono}>
										{certification.provider}
									</span>
								</li>
							))}
						</ol>
					</section>
				)}
			</div>
		</div>
	);
};

export default Resume;
