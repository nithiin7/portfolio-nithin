import type { FC, ReactElement } from 'react';

import ScrambleText from 'components/motion/ScrambleText/ScrambleText';
import type { Capability } from 'types/home';

import styles from './HomeCapabilities.module.scss';

interface HomeCapabilitiesProps {
	className?: string;
	data?: { title?: string; subTitle?: string };
	capabilities?: Capability[];
}

/** Capabilities grid. */
const HomeCapabilities: FC<HomeCapabilitiesProps> = ({
	className = '',
	data,
	capabilities = [],
}): ReactElement | null => {
	if (capabilities.length === 0) return null;

	return (
		<section
			id="services"
			className={`${styles.HomeCapabilities} ${className}`}
		>
			<div className={styles.HomeCapabilities__inner}>
				<header className={styles.HomeCapabilities__head}>
					<p className={styles.HomeCapabilities__label}>Capabilities</p>
					<ScrambleText
						as="h2"
						className={styles.HomeCapabilities__title}
						text={data?.title || 'What I do.'}
					/>
					{data?.subTitle && (
						<p className={styles.HomeCapabilities__lede}>{data.subTitle}</p>
					)}
				</header>

				<ol className={styles.HomeCapabilities__grid}>
					{capabilities.map(
						({ title, summary: description, items: list }, i) => (
							<li key={title} className={styles.HomeCapabilities__col}>
								<span
									className={styles.HomeCapabilities__index}
									aria-hidden="true"
								>
									{String(i + 1).padStart(2, '0')}
								</span>
								<h3 className={styles.HomeCapabilities__name}>{title}</h3>
								<p className={styles.HomeCapabilities__desc}>{description}</p>
								{list.length > 0 && (
									<ul className={styles.HomeCapabilities__list}>
										{list.map((entry) => (
											<li key={entry}>{entry}</li>
										))}
									</ul>
								)}
							</li>
						)
					)}
				</ol>
			</div>
		</section>
	);
};

export default HomeCapabilities;
