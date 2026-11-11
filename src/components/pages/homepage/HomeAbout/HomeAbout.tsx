import Image from 'next/image';
import type { FC, ReactElement } from 'react';

import { RevealImage, RevealText } from 'components/motion';
import CountUp from 'components/pages/stats/CountUp/CountUp';
import { aboutContent } from 'config/about';

import styles from './HomeAbout.module.scss';

export interface AboutStat {
	value: number;
	label: string;
	suffix?: string;
	compact?: boolean;
}

interface HomeAboutProps {
	className?: string;
	title?: string;
	portraitUrl?: string;
	stats?: AboutStat[];
}

const HomeAbout: FC<HomeAboutProps> = ({
	className = '',
	title,
	portraitUrl,
	stats = [],
}): ReactElement => {
	const [lede, ...rest] = aboutContent.bio;

	return (
		<section id="about" className={`${styles.HomeAbout} ${className}`}>
			<div className={styles.HomeAbout__inner}>
				<header className={styles.HomeAbout__head}>
					<p className={styles.HomeAbout__label}>About</p>
					<RevealText as="h2" className={styles.HomeAbout__title}>
						{title || 'A little bit about me.'}
					</RevealText>
				</header>

				<div className={styles.HomeAbout__body}>
					{portraitUrl && (
						<RevealImage className={styles.HomeAbout__portrait}>
							<Image
								src={portraitUrl}
								alt="Portrait of Nithin Pradeep"
								fill
								sizes="(min-width: 1024px) 34vw, (min-width: 768px) 45vw, 100vw"
							/>
						</RevealImage>
					)}

					<div className={styles.HomeAbout__copy}>
						<p className={styles.HomeAbout__lede}>{lede}</p>
						{rest.map((paragraph) => (
							<p key={paragraph} className={styles.HomeAbout__para}>
								{paragraph}
							</p>
						))}

						<h3 className={styles.HomeAbout__label}>How I work</h3>
						<ol className={styles.HomeAbout__principles}>
							{aboutContent.howIWork.map(({ title: heading, body }, i) => (
								<li key={heading} className={styles.HomeAbout__principle}>
									<span className={styles.HomeAbout__index} aria-hidden="true">
										{String(i + 1).padStart(2, '0')}
									</span>
									<span className={styles.HomeAbout__principleTitle}>
										{heading}
									</span>
									<span className={styles.HomeAbout__principleBody}>
										{body}
									</span>
								</li>
							))}
						</ol>
					</div>
				</div>

				{stats.length > 0 && (
					<dl className={styles.HomeAbout__stats}>
						{stats.map(({ value, label, suffix, compact }) => (
							<div key={label} className={styles.HomeAbout__stat}>
								<dt className={styles.HomeAbout__statLabel}>{label}</dt>
								<dd className={styles.HomeAbout__statValue}>
									<CountUp value={value} suffix={suffix} compact={compact} />
								</dd>
							</div>
						))}
					</dl>
				)}
			</div>
		</section>
	);
};

export default HomeAbout;
