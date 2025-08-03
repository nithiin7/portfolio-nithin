import type { FC } from 'react';

import { CircleIcon, OvalIcon, StarIcon } from 'assets/icons';

import styles from './ServiceCard.module.scss';

interface ServiceCardProps {
	description?: string;
	heading?: string;
	list?: string[];
	i?: number;
}

/**
 * `ServiceCard` component displays a service offering with a heading,
 * description, and a list of features or services.
 *
 * @param {ServiceCardProps} props - Component properties.
 * @param {string} [props.description] - Description of the service (default: 'No description provided').
 * @param {string} [props.heading] - Heading/title of the service (default: 'Service Heading').
 * @param {string[]} [props.list] - Array of services or features.
 * @param {number} [props.i] - Index of the service card for positioning (default: 0).
 * @returns {JSX.Element} - Rendered ServiceCard component.
 */
const ServiceCard: FC<ServiceCardProps> = ({
	description = 'No description provided',
	heading = 'Service Heading',
	list = [],
	i = 0,
}) => {
	const getIcon = (index: number) => {
		const iconIndex = index % 3;
		switch (iconIndex) {
			case 0:
				return <CircleIcon />;
			case 1:
				return <OvalIcon />;
			case 2:
				return <StarIcon />;
			default:
				return <CircleIcon />;
		}
	};

	return (
		<div
			className={styles.ServiceCard}
			style={{
				top: `calc(8vh + ${i * 100}px)`,
			}}
		>
			<div className={styles.ServiceCard__header}>
				<div>{getIcon(i)}</div>
				<h3>{heading}</h3>
			</div>
			<div className={styles.ServiceCard__body}>
				<p>{description}</p>
				<div className={styles.ServiceCard__services}>
					{list.map((item, index) => (
						<span key={`${item}-${index}`}>{item}</span>
					))}
				</div>
			</div>
			<div className={styles.ServiceCard__background}>
				<span>0{i}.</span>
			</div>
		</div>
	);
};

export default ServiceCard;
