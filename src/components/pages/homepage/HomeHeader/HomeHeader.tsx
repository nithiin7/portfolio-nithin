'use client';
import { motion, useMotionValue, useSpring } from 'motion/react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import Logo from 'assets/images/nav-logo.svg';
import Cursor from 'components/utilities/Cursor/Cursor';
import MaskText from 'components/utilities/MaskText/MaskText';
import type { Settings } from 'types/anim';

import styles from './HomeHeader.module.scss';

interface HomeHeaderProps {
	className?: string;
	data?: {
		items: {
			title?: string;
			subTitle?: string;
		}[];
	};
}

const settings: Settings = {
	damping: 100,
	stiffness: 600,
	maxDistance: 300,
	intensity: 0.1,
};

/**
 * HomeHeader component displays the main header of the homepage with an animated logo
 * that responds to mouse movement and a customizable title/subtitle.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @param {Object} [data] - Content data for the header.
 * @param {Object[]} [data.items] - Array containing title and subtitle for display.
 * @param {string} [data.items[].title] - Main title text.
 * @param {string} [data.items[].subTitle] - Subtitle text.
 * @returns {JSX.Element} The rendered HomeHeader component.
 */
const HomeHeader: FC<HomeHeaderProps> = ({
	className = '',
	data = { items: [] },
}) => {
	const [componentRef, setComponentRef] = useState<null | HTMLDivElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springConfig = {
		damping: settings.damping,
		stiffness: settings.stiffness,
	};
	const springX = useSpring(x, springConfig);
	const springY = useSpring(y, springConfig);

	useEffect(() => {
		/**
		 * Calculates the distance between the cursor and the center of the component.
		 * Updates the x and y motion values based on proximity to the component center,
		 * creating a parallax-like effect when the cursor is within a set distance.
		 *
		 * @param {MouseEvent} e - The mousemove event containing the cursor's coordinates.
		 */
		const calculateDistance = (e: MouseEvent) => {
			if (componentRef) {
				const rect = componentRef.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;
				const distanceX = e.clientX - centerX;
				const distanceY = e.clientY - centerY;

				if (
					Math.abs(distanceX) < settings.maxDistance &&
					Math.abs(distanceY) < settings.maxDistance
				) {
					const proximityFactor =
						1 -
						Math.max(Math.abs(distanceX), Math.abs(distanceY)) /
							settings.maxDistance;
					x.set(distanceX * proximityFactor * settings.intensity);
					y.set(distanceY * proximityFactor * settings.intensity);
				} else {
					x.set(0);
					y.set(0);
				}
			}
		};

		/**
		 * Mousemove event handler that triggers `calculateDistance` to update the
		 * motion values based on cursor position.
		 *
		 * @param {MouseEvent} e - The mousemove event.
		 */
		const handleMouseMove = (e: MouseEvent) => {
			calculateDistance(e);
		};

		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, [componentRef]);

	return (
		<header className={`${styles.HomeHeader} ${className}`}>
			<div className={styles.header__nav}>
				<motion.div
					ref={setComponentRef}
					style={{
						x: springX,
						y: springY,
						zIndex: 99,
					}}
				>
					<Logo />
				</motion.div>
			</div>
			<div id="home" className={styles.portfolio__header}>
				<svg
					width="1186"
					height="1186"
					viewBox="0 0 1186 1186"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{
						opacity: 1,
						zIndex: -20,
						transform: 'translateX(-50%) translateY(-50%) scale(1)',
					}}
				>
					<circle
						cx="593"
						cy="593"
						r="593"
						fill="url(#paint0_linear_4949_267)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_4949_267"
							x1="593"
							y1="0"
							x2="593"
							y2="1186"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#DDDDD5" />
							<stop offset="1" stopColor="#DDDDD5" stopOpacity="0" />
						</linearGradient>
					</defs>
				</svg>
				<div className={styles.header__description}>
					<h1
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						data-aos="fade-up"
						data-aos-duration="1000"
						data-aos-once="true"
						data-aos-delay="800"
					>
						<MaskText phrases={[data.items[0]?.title ?? '']} />
						<MaskText phrases={[data.items[0]?.subTitle ?? '']} />
					</h1>
					<p
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						data-aos-delay="800"
					>
						A web developer & web designer propelling visions to reality.
					</p>
				</div>
			</div>
			<Cursor isHovered={isHovered} />
		</header>
	);
};

export default HomeHeader;
