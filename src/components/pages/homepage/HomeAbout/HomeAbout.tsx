'use client';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import type { FC } from 'react';
import { useRef } from 'react';

import { BackgroundShapes, MaskText } from 'components/utilities';
import type { BackgroundShapeProps } from 'components/utilities';

import styles from './HomeAbout.module.scss';

interface HomeAboutProps {
	className?: string;
	data?: {
		items: {
			title: string;
			image: {
				url: string;
			};
			descriptionLong?: {
				json: Document;
			};
		}[];
	};
	backgroundShapes?: {
		left?: Partial<BackgroundShapeProps>;
		right?: Partial<BackgroundShapeProps>;
	};
}

/**
 * HomeAbout component displaying an introductory section about the user,
 * including a masked title, rich text description, and an image with configurable background shapes.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @param {Object} [data] - Data for the component, including items with title, image, and rich text description.
 * @param {Object[]} [data.items] - Array containing content items.
 * @param {string} [data.items[].title] - Title for the mask text.
 * @param {string} [data.items[].image.url] - URL of the image.
 * @param {Object} [data.items[].descriptionLong] - Rich text content from Contentful.
 * @param {any} [data.items[].descriptionLong.json] - JSON structure of the rich text content.
 * @param {Object} [backgroundShapes] - Configuration for background decorative shapes.
 * @param {Object} [backgroundShapes.left] - Left background shape configuration.
 * @param {Object} [backgroundShapes.right] - Right background shape configuration.
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
	backgroundShapes = {
		left: {
			className: styles['HomeAbout__image-left'],
			viewBox: '0 0 709 300',
			fill: '#AFAF9D',
		},
		right: {
			className: styles['HomeAbout__image-right'],
			viewBox: '0 0 594 209',
			fill: '#E8E8E3',
			transform: 'rotate(-180 594 209)',
		},
	},
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start end', 'end start'],
	});

	const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);

	const richTextContent = data.items?.[2]?.descriptionLong?.json;

	return (
		<div ref={containerRef} className={`${styles.HomeAbout} ${className}`}>
			<section id="about">
				<div className={styles.HomeAbout__container}>
					<div className={styles.HomeAbout__content}>
						<h2>
							<MaskText phrases={[data.items?.[0]?.title || '']} />
						</h2>
						<BackgroundShapes
							left={backgroundShapes.left}
							right={backgroundShapes.right}
						/>
						<motion.div
							className={styles.HomeAbout__image}
							style={{ y: imageY }}
						>
							{data.items?.[1]?.image.url && (
								<Image
									src={data.items[1].image.url}
									alt="about-me"
									height={1000}
									width={1000}
									quality={100}
								/>
							)}
							<div
								className={styles.HomeAbout__gradient}
								aria-hidden="true"
							></div>
						</motion.div>
					</div>
					<div className={styles.HomeAbout__description}>
						<span>
							{richTextContent && documentToReactComponents(richTextContent)}
						</span>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomeAbout;
