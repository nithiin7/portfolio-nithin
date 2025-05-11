'use client';
import MaskText from 'components/utilities/MaskText/MaskText';
import Image from 'next/image';
import type { FC } from 'react';

import styles from './HomeAbout.module.scss';

interface HomeAboutProps {
	className?: string;
	data?: {
		items: {
			title: string;
			image: {
				url: string;
			};
		}[];
	};
}

/**
 * HomeAbout component displaying an introductory section about the user,
 * including a masked title, descriptive text, and an image.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @param {Object} [data] - Data for the component, including items with title and image.
 * @param {Object[]} [data.items] - Array containing content items.
 * @param {string} [data.items[].title] - Title for the mask text.
 * @param {string} [data.items[].image.url] - URL of the image.
 * @returns {JSX.Element} The rendered HomeAbout component.
 */
const HomeAbout: FC<HomeAboutProps> = ({
	className = '',
	data = {
		items: [
			{
				title: '',
				image: {
					url: '',
				},
			},
		],
	},
}) => {
	const text = `A passionate Full Stack Developer from Kochi, Kerala. Specializing in frontend magic—from captivating UI effects to dynamic animations—I thrive on ambitious projects that push boundaries. Beyond coding, you'll find me immersed in football, gaming, TV series, or admiring the latest in automobiles. Lets craft exceptional experiences together!`;

	return (
		<div className={`${styles.HomeAbout} ${className}`}>
			<section id="about">
				<div className={styles.HomeAbout__container}>
					<div className={styles.HomeAbout__content}>
						<h2>
							<MaskText phrases={[data.items?.[0]?.title || '']} />
						</h2>
						<svg
							className={styles['HomeAbout__image-left']}
							viewBox="0 0 709 300"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<rect width="709" height="300" rx="169.963" fill="#AFAF9D" />
						</svg>
						<svg
							className={styles['HomeAbout__image-right']}
							viewBox="0 0 594 209"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<rect
								x="594"
								y="209"
								width="594"
								height="209"
								rx="126.5"
								transform="rotate(-180 594 209)"
								fill="#E8E8E3"
							/>
						</svg>
						<div className={styles.HomeAbout__image}>
							<Image
								src={data.items?.[1]?.image.url || ''}
								alt="about-me"
								height={1000}
								width={1000}
								quality={100}
							/>
							<div className={styles.HomeAbout__gradient} aria-hidden="true"></div>
						</div>
					</div>
					<p className={styles.HomeAbout__description}>
						<span>{text}</span>
					</p>
				</div>
			</section>
		</div>
	);
};

export default HomeAbout;
