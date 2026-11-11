import type { FC, ReactElement } from 'react';

import { RevealText } from 'components/motion';
import type { ServiceHeader, ServiceItem } from 'types/service';

import styles from './HomeCapabilities.module.scss';

interface HomeCapabilitiesProps {
	className?: string;
	data?: Partial<ServiceHeader>;
	services?: ServiceItem[];
}

interface Capability {
	title: string;
	description: string;
	list: string[];
}

const toCapabilities = (services: ServiceItem[]): Capability[] =>
	services.flatMap((item) => {
		if (item.__typename !== 'Section') return [];
		const [heading, list] = item.contentsCollection.items;
		if (!heading?.title) return [];
		return [
			{
				title: heading.title,
				description: heading.subTitle ?? '',
				list: list?.list ?? [],
			},
		];
	});

const HomeCapabilities: FC<HomeCapabilitiesProps> = ({
	className = '',
	data,
	services = [],
}): ReactElement | null => {
	const capabilities = toCapabilities(services);
	if (capabilities.length === 0) return null;

	return (
		<section
			id="services"
			className={`${styles.HomeCapabilities} ${className}`}
		>
			<div className={styles.HomeCapabilities__inner}>
				<header className={styles.HomeCapabilities__head}>
					<p className={styles.HomeCapabilities__label}>Capabilities</p>
					<RevealText as="h2" className={styles.HomeCapabilities__title}>
						{data?.title || 'What I do.'}
					</RevealText>
					{data?.subTitle && (
						<p className={styles.HomeCapabilities__lede}>{data.subTitle}</p>
					)}
				</header>

				<ol className={styles.HomeCapabilities__grid}>
					{capabilities.map(({ title, description, list }, i) => (
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
					))}
				</ol>
			</div>
		</section>
	);
};

export default HomeCapabilities;
