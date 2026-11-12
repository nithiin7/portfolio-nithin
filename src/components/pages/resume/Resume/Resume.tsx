import type { FC, ReactElement } from 'react';

import RevealText from 'components/motion/RevealText/RevealText';
import type { Experience } from 'types/career';
import type { Certification } from 'types/certification';
import type { Capability } from 'types/home';
import type { SiteSettings } from 'types/site';

import styles from './Resume.module.scss';

interface ResumeProps {
	site: SiteSettings;
	bio: string[];
	capabilities?: Capability[];
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
	site,
	bio,
	capabilities = [],
	experiences,
	certifications = [],
	resumeUrl,
}): ReactElement => {
	const sortedExperiences = [...experiences].sort((a, b) =>
		b.startDate.localeCompare(a.startDate)
	);

	const skillGroups = capabilities
		.map((item) => ({ heading: item.title, skills: item.items }))
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
					{site.name}
				</RevealText>
				<p className={styles.Resume__role}>
					{site.role}, {site.company} — {site.location.city}
				</p>
				<ul className={styles.Resume__contacts} aria-label="Contact">
					{site.contactChannels.map((option) => (
						<li key={option.url}>
							<a
								className={styles.Resume__link}
								href={option.url}
								{...(option.url.startsWith('mailto:')
									? {}
									: { target: '_blank', rel: 'noopener noreferrer' })}
							>
								{option.label}: {option.detail ?? option.url}
							</a>
						</li>
					))}
					{site.socials.map((social) => (
						<li key={social.url}>
							<a
								className={styles.Resume__link}
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								{social.label}
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
						{bio.map((paragraph) => (
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
