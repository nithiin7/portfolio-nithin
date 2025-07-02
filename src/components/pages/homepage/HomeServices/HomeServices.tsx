'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import type { FC } from 'react';

import ServiceCard from 'components/pages/ServiceCard';
import MaskText from 'components/utilities/MaskText/MaskText';
import type { ServiceHeader, ServiceItem } from 'types/service';

import styles from './HomeServices.module.scss';

interface HomeServicesProps {
	className?: string;
	data: ServiceHeader;
	services: ServiceItem[];
}

/**
 * `HomeServices` component displays a section of services offered,
 * including a header and a list of service cards.
 *
 * @param {HomeServicesProps} props - Component properties.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {ServiceHeader} props.data - Header data containing the title and subtitle.
 * @param {ServiceItem[]} props.services - List of service items to display.
 * @returns {JSX.Element} - Rendered HomeServices component.
 */
const HomeServices: FC<HomeServicesProps> = ({
	className = '',
	data = { title: '', subTitle: '' },
	services = [],
}) => {
	const { scrollY } = useScroll();

	const servicesY = useTransform(scrollY, [200, 800], [50, 0]);
	const servicesOpacity = useTransform(scrollY, [200, 700], [0, 1]);
	const servicesScale = useTransform(scrollY, [200, 700], [0.96, 1]);

	return (
		<motion.div
			className={`${styles.HomeServices} ${className}`}
			style={{
				y: servicesY,
				opacity: servicesOpacity,
				scale: servicesScale,
			}}
		>
			<section id="services">
				<div className={styles.services__header}>
					<h2>
						<MaskText phrases={[data.title]} />
					</h2>
					<p>{data.subTitle}</p>
				</div>
				<div>
					{services.map((item, index) => {
						if (item.__typename === 'Section') {
							return (
								<ServiceCard
									key={`${item.contentsCollection.items[0].title}-${index}`}
									i={index}
									heading={item.contentsCollection.items[0].title}
									list={item.contentsCollection.items[1].list}
									description={item.contentsCollection.items[0].subTitle}
								/>
							);
						}
						return null;
					})}
				</div>
			</section>
		</motion.div>
	);
};

export default HomeServices;
