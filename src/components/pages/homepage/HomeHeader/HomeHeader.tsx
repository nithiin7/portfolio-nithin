'use client';
import {
	motion,
	useMotionValue,
	useSpring,
	useScroll,
	useTransform,
} from 'motion/react';
import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';

import Logo from 'assets/logos/logo.svg';
import ColorMaskButton from 'components/utilities/ColorMaskButton/ColorMaskButton';
import Cursor from 'components/utilities/Cursor/Cursor';
import MaskText from 'components/utilities/MaskText/MaskText';
import { headerLinks } from 'constants/index';
import { useTheme } from 'contexts/ThemeContext';
import type { Settings } from 'types/anim';

import styles from './HomeHeader.module.scss';

interface HomeHeaderProps {
	className?: string;
	data?: {
		items: {
			title?: string;
			subTitle?: string;
			descriptionShort?: string;
		}[];
	};
}

const settings: Settings = {
	damping: 100,
	stiffness: 600,
	maxDistance: 300,
	intensity: 0.1,
};

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 1.2,
			ease: [0.25, 0.46, 0.45, 0.94],
			staggerChildren: 0.15,
		},
	},
};

const logoVariants = {
	hidden: {
		opacity: 0,
		y: -40,
		scale: 0.8,
		rotate: -5,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		rotate: 0,
		transition: {
			duration: 1.2,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: 0.8,
		},
	},
};

const backgroundVariants = {
	hidden: {
		opacity: 0,
		scale: 0.9,
		rotate: -5,
	},
	visible: {
		opacity: 1,
		scale: 1,
		rotate: 0,
		transition: {
			duration: 1.5,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: 0.4,
		},
	},
};

const contentVariants = {
	hidden: {
		opacity: 0,
		y: 60,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 1.2,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: 0.6,
		},
	},
};

const descriptionVariants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 1,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: 1,
		},
	},
};

const navigationVariants = {
	hidden: {
		opacity: 0,
		y: -20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: 1.2,
		},
	},
};

const navItemVariants = {
	hidden: {
		opacity: 0,
		y: 10,
	},
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: 1.3 + i * 0.1,
		},
	}),
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
	const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
	const headerRef = useRef<HTMLElement>(null);

	/**
	 * Handles smooth scrolling to sections when navigation links are clicked.
	 * @param {string} href - The href attribute of the clicked link
	 * @param {MouseEvent} e - The click event
	 */
	const handleNavClick = (href: string, e: MouseEvent) => {
		if (href.startsWith('/#')) {
			e.preventDefault();
			const targetId = href.replace('/#', '');
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
		}
	};

	const { theme } = useTheme();

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springConfig = {
		damping: settings.damping,
		stiffness: settings.stiffness,
	};
	const springX = useSpring(x, springConfig);
	const springY = useSpring(y, springConfig);

	const { scrollY } = useScroll();

	const headerTopY = useTransform(scrollY, [0, 300], [0, -100]);
	const headerTopOpacity = useTransform(scrollY, [0, 250], [1, 0]);

	const navY = useTransform(scrollY, [0, 350], [0, -150]);
	const navOpacity = useTransform(scrollY, [0, 300], [1, 0]);

	const logoY = useTransform(scrollY, [0, 400], [0, -120]);
	const logoOpacity = useTransform(scrollY, [0, 350], [1, 0]);

	const ctaY = useTransform(scrollY, [0, 450], [0, -180]);
	const ctaOpacity = useTransform(scrollY, [0, 400], [1, 0]);

	const contentY = useTransform(scrollY, [0, 500], [0, -200]);
	const contentOpacity = useTransform(scrollY, [0, 450], [1, 0]);
	const contentScale = useTransform(scrollY, [0, 500], [1, 0.8]);

	const backgroundY = useTransform(scrollY, [0, 500], [0, -200]);
	const backgroundScale = useTransform(scrollY, [0, 600], [1, 1.2]);
	const backgroundOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

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
	}, [componentRef, x, y]);

	return (
		<motion.header
			ref={headerRef}
			className={`${styles.HomeHeader} ${className}`}
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			style={{
				transform: `translateY(${headerTopY}px)`,
				opacity: headerTopOpacity,
			}}
		>
			<div className={styles.HomeHeader__top}>
				<motion.div
					className={styles.HomeHeader__nav}
					variants={logoVariants}
					whileHover={{
						scale: 1.05,
						transition: { duration: 0.3, ease: 'easeOut' },
					}}
					style={{
						y: logoY,
						opacity: logoOpacity,
					}}
				>
					<motion.div
						ref={setComponentRef}
						className={styles.HomeHeader__logoWrapper}
						style={{
							x: springX,
							y: springY,
							zIndex: 99,
						}}
					>
						<Logo />
					</motion.div>
				</motion.div>
				<motion.nav
					className={styles.HomeHeader__navigation}
					variants={navigationVariants}
					initial="hidden"
					animate="visible"
					style={{
						y: navY,
						opacity: navOpacity,
					}}
				>
					<ul className={styles.HomeHeader__list}>
						{headerLinks.map((link, index) => (
							<motion.li
								key={link.title}
								className={styles.HomeHeader__item}
								custom={index}
								variants={navItemVariants}
								onHoverStart={() => setActiveNavItem(link.title)}
								onHoverEnd={() => setActiveNavItem(null)}
							>
								<motion.a
									href={link.href}
									className={styles.HomeHeader__link}
									onClick={(e) => handleNavClick(link.href, e as any)}
									whileHover={{
										y: -2,
										transition: { duration: 0.2, ease: 'easeOut' },
									}}
									transition={{ duration: 0.3, ease: 'easeInOut' }}
								>
									{link.title}
									<motion.span
										className={styles.HomeHeader__underline}
										initial={{ scaleX: 0 }}
										animate={{
											scaleX: activeNavItem === link.title ? 1 : 0,
										}}
										transition={{ duration: 0.3, ease: 'easeInOut' }}
									/>
								</motion.a>
							</motion.li>
						))}
					</ul>
				</motion.nav>
				<motion.div
					className={styles.HomeHeader__cta}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.6,
						ease: [0.25, 0.46, 0.45, 0.94],
						delay: 1.8,
					}}
					style={{
						y: ctaY,
						opacity: ctaOpacity,
					}}
				>
					<ColorMaskButton
						text="Book a Call"
						href="/contact"
						className={styles.HomeHeader__button}
					/>
				</motion.div>
			</div>
			<div id="home" className={styles.HomeHeader__header}>
				<motion.svg
					width="1186"
					height="1186"
					viewBox="0 0 1186 1186"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					variants={backgroundVariants}
					style={{
						opacity: backgroundOpacity,
						zIndex: -20,
						transform: `translateX(-50%) translateY(-50%) scale(${backgroundScale})`,
						y: backgroundY,
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
							<stop stopColor={theme === 'dark' ? '#DDDDD5' : '#393632'} />
							<stop
								offset="1"
								stopColor={theme === 'dark' ? '#DDDDD5' : '#393632'}
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>
				</motion.svg>
				<motion.div
					className={styles.HomeHeader__description}
					variants={contentVariants}
					style={{
						y: contentY,
						opacity: contentOpacity,
						scale: contentScale,
					}}
				>
					<motion.button
						className={styles.HomeHeader__title}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					>
						<h1 className={styles.HomeHeader__animatedTitle}>
							<MaskText phrases={[data.items[0]?.title ?? '']} delay={0.75} />
							<MaskText
								phrases={[data.items[0]?.subTitle ?? '']}
								delay={1.25}
							/>
						</h1>
					</motion.button>
					<motion.p
						variants={descriptionVariants}
						initial="hidden"
						animate="visible"
					>
						{data.items[1].descriptionShort}
					</motion.p>
				</motion.div>
			</div>
			<Cursor isHovered={isHovered} />
		</motion.header>
	);
};

export default HomeHeader;
