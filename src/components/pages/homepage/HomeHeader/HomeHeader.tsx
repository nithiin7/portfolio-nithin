'use client';
import { useLenis } from 'lenis/react';
import type { Variants } from 'motion/react';
import {
	motion,
	useMotionValue,
	useMotionTemplate,
	useReducedMotion,
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
import { handleScroll } from 'helpers';
import { useMagneticHover } from 'hooks/useMagneticHover';
import type { Settings } from 'types/anim';

import styles from './HomeHeader.module.scss';

const AVAILABILITY_STATUS = 'Available for new projects';

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

const containerVariants: Variants = {
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

const logoVariants: Variants = {
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

const backgroundVariants: Variants = {
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

const contentVariants: Variants = {
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

const statusVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 16,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: 0.4,
		},
	},
};

const descriptionVariants: Variants = {
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

const navigationVariants: Variants = {
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

const navItemVariants: Variants = {
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
	const lenis = useLenis();

	/**
	 * Handles smooth scrolling to sections when navigation links are clicked.
	 * Uses Lenis rather than native scrollIntoView, since the target sections
	 * have scroll-linked entrance transforms that fight the browser's own
	 * smooth-scroll and cause it to overshoot.
	 * @param {string} href - The href attribute of the clicked link
	 * @param {{ preventDefault: () => void }} e - The click event
	 */
	const handleNavClick = (href: string, e: { preventDefault: () => void }) => {
		if (href.startsWith('/#')) {
			e.preventDefault();
			const targetId = href.replace('/#', '');
			handleScroll(targetId, lenis);
		}
	};

	const { theme } = useTheme();
	const prefersReducedMotion = useReducedMotion();

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springConfig = {
		damping: settings.damping,
		stiffness: settings.stiffness,
	};
	const springX = useSpring(x, springConfig);
	const springY = useSpring(y, springConfig);

	const blobX = useMotionValue(0);
	const blobY = useMotionValue(0);
	const blobSpringConfig = { damping: 50, stiffness: 40 };
	const blobSpringX = useSpring(blobX, blobSpringConfig);
	const blobSpringY = useSpring(blobY, blobSpringConfig);

	const { boundsRef: ctaBoundsRef, magneticRef: ctaMagneticRef } =
		useMagneticHover<HTMLDivElement, HTMLDivElement>({
			strength: 0.4,
			scale: 1.06,
		});

	const { scrollY } = useScroll();

	const headerTopY = useTransform(
		scrollY,
		[0, 300],
		prefersReducedMotion ? [0, 0] : [0, -100]
	);
	const headerTopOpacity = useTransform(scrollY, [0, 250], [1, 0]);

	const navY = useTransform(
		scrollY,
		[0, 350],
		prefersReducedMotion ? [0, 0] : [0, -150]
	);
	const navOpacity = useTransform(scrollY, [0, 300], [1, 0]);

	const logoY = useTransform(
		scrollY,
		[0, 400],
		prefersReducedMotion ? [0, 0] : [0, -120]
	);
	const logoOpacity = useTransform(scrollY, [0, 350], [1, 0]);

	const ctaY = useTransform(
		scrollY,
		[0, 450],
		prefersReducedMotion ? [0, 0] : [0, -180]
	);
	const ctaOpacity = useTransform(scrollY, [0, 400], [1, 0]);

	const contentY = useTransform(
		scrollY,
		[0, 500],
		prefersReducedMotion ? [0, 0] : [0, -200]
	);
	const contentOpacity = useTransform(scrollY, [0, 450], [1, 0]);
	const contentScale = useTransform(
		scrollY,
		[0, 500],
		prefersReducedMotion ? [1, 1] : [1, 0.8]
	);

	const backgroundScrollY = useTransform(
		scrollY,
		[0, 500],
		prefersReducedMotion ? [0, 0] : [0, -200]
	);
	const backgroundScale = useTransform(
		scrollY,
		[0, 600],
		prefersReducedMotion ? [1, 1] : [1, 1.2]
	);
	const backgroundOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
	const backgroundY = useTransform(
		() => backgroundScrollY.get() + blobSpringY.get()
	);
	const backgroundTransform = useMotionTemplate`translate(${blobSpringX}px, ${backgroundY}px) scale(${backgroundScale})`;

	useEffect(() => {
		if (prefersReducedMotion) return;

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
		 * Drives the background blob toward the cursor, scaled down and relative
		 * to viewport center rather than a single element (unlike `calculateDistance`).
		 *
		 * @param {MouseEvent} e - The mousemove event.
		 */
		const updateBlobPosition = (e: MouseEvent) => {
			blobX.set((e.clientX - window.innerWidth / 2) * 0.04);
			blobY.set((e.clientY - window.innerHeight / 2) * 0.04);
		};

		const handleMouseMove = (e: MouseEvent) => {
			calculateDistance(e);
			updateBlobPosition(e);
		};

		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, [componentRef, x, y, blobX, blobY, prefersReducedMotion]);

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
									onClick={(e) => handleNavClick(link.href, e)}
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
					<div ref={ctaBoundsRef} className={styles.HomeHeader__magneticBounds}>
						<div
							ref={ctaMagneticRef}
							className={styles.HomeHeader__magneticContent}
						>
							<ColorMaskButton
								text="Book a Call"
								href="/contact"
								className={styles.HomeHeader__button}
							/>
						</div>
					</div>
				</motion.div>
			</div>
			<div id="home" className={styles.HomeHeader__header}>
				<div className={styles.HomeHeader__backgroundFloat}>
					<motion.svg
						width="1186"
						height="1186"
						viewBox="0 0 1186 1186"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						variants={backgroundVariants}
						style={{
							opacity: backgroundOpacity,
							transform: backgroundTransform,
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
				</div>
				<motion.div
					className={styles.HomeHeader__description}
					variants={contentVariants}
					style={{
						y: contentY,
						opacity: contentOpacity,
						scale: contentScale,
					}}
				>
					<motion.div
						className={styles.HomeHeader__status}
						variants={statusVariants}
						initial="hidden"
						animate="visible"
					>
						<span className={styles.HomeHeader__statusDot} />
						{AVAILABILITY_STATUS}
					</motion.div>
					<motion.button
						className={styles.HomeHeader__title}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					>
						<h1 className={styles.HomeHeader__animatedTitle}>
							<MaskText
								phrases={[data.items[0]?.title ?? '']}
								delay={0.75}
								charVariant="flip"
							/>
							<MaskText
								phrases={[data.items[0]?.subTitle ?? '']}
								delay={1.25}
								charVariant="flip"
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
				<motion.button
					type="button"
					className={styles.HomeHeader__scrollCue}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 1.6 }}
					onClick={(e) => handleNavClick('/#services', e)}
					aria-label="Scroll to next section"
				>
					<span className={styles.HomeHeader__scrollCueTrack}>
						<motion.span
							className={styles.HomeHeader__scrollCueDot}
							animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
							transition={{
								duration: 1.8,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						/>
					</span>
					Scroll
				</motion.button>
			</div>
			<Cursor isHovered={isHovered} />
		</motion.header>
	);
};

export default HomeHeader;
