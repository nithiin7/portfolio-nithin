'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { CareerCard } from 'components/pages';
import { MaskText } from 'components/utilities';
import type { Experience } from 'types/career';

import styles from './HomeCareer.module.scss';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const DESKTOP_STORY =
	'(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const MOBILE_STORY =
	'(max-width: 1023px) and (prefers-reduced-motion: no-preference)';

const VIEWBOX_WIDTH = 120;
const VIEWBOX_HEIGHT = 1000;

interface HomeCareerProps {
	className?: string;
	data?: {
		title?: string;
		subtitle?: string;
	};
	experiences?: Experience[];
}

/**
 * HomeCareer renders the career timeline as a pinned scroll story:
 * an SVG path draws itself as the user scrolls while experience
 * cards and milestone nodes animate in along it. Small screens and
 * reduced-motion users get a static vertical timeline instead.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @param {Object} [data] - Data for the component, including title and subtitle.
 * @param {Experience[]} [experiences] - Array of career experiences.
 * @returns {JSX.Element} The rendered HomeCareer component.
 */
const HomeCareer: React.FC<HomeCareerProps> = ({
	className = '',
	data = {
		title: 'Career Journey',
		subtitle: 'Building digital experiences across different industries',
	},
	experiences = [],
}) => {
	const pinRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const pathRef = useRef<SVGPathElement>(null);
	const stepperFillRef = useRef<HTMLSpanElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	const sortedExperiences = useMemo(
		() =>
			[...experiences].sort(
				(a, b) => parseInt(a.year, 10) - parseInt(b.year, 10)
			),
		[experiences]
	);

	const nodes = useMemo(() => {
		const count = sortedExperiences.length;
		if (count < 2) {
			return sortedExperiences.map(() => ({ x: 60, y: 500 }));
		}
		return sortedExperiences.map((_, index) => ({
			x: index % 2 === 0 ? 38 : 82,
			y: 60 + (880 / (count - 1)) * index,
		}));
	}, [sortedExperiences]);

	const pathD = useMemo(() => {
		if (nodes.length < 2) return 'M 60 100 L 60 900';
		return nodes.reduce((d, point, index) => {
			if (index === 0) return `M ${point.x} ${point.y}`;
			const prev = nodes[index - 1];
			const midY = (prev.y + point.y) / 2;
			return `${d} C ${prev.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
		}, '');
	}, [nodes]);

	useEffect(() => {
		const count = sortedExperiences.length;
		if (count === 0) return;

		const mm = gsap.matchMedia();

		mm.add({ desktop: DESKTOP_STORY, mobile: MOBILE_STORY }, (context) => {
			const pin = pinRef.current;
			const stage = stageRef.current;
			const path = pathRef.current;
			if (!pin || !stage || !path) return;

			const pinTarget = context.conditions?.desktop ? pin : stage;
			const cards = gsap.utils.toArray<HTMLElement>('[data-career-card]', pin);

			const pathLength = path.getTotalLength();

			gsap.set(path, {
				strokeDasharray: pathLength,
				strokeDashoffset: pathLength,
				autoAlpha: 1,
			});
			gsap.set(cards.slice(1), { autoAlpha: 0, y: 48 });

			const tl = gsap.timeline({
				defaults: { ease: 'none' },
				onUpdate: () => {
					setActiveIndex(
						Math.min(count - 1, Math.max(0, Math.floor(tl.time() + 0.001)))
					);
				},
				scrollTrigger: {
					trigger: pinTarget,
					start: 'top top',
					end: `+=${count * 90}%`,
					pin: true,
					scrub: 0.6,
				},
			});

			tl.to(path, { strokeDashoffset: 0, duration: Math.max(count - 1, 1) }, 0);

			const stepperFill = stepperFillRef.current;
			if (stepperFill) {
				gsap.set(stepperFill, { scaleX: 0 });
				tl.to(stepperFill, { scaleX: 1, duration: Math.max(count - 1, 1) }, 0);
			}

			cards.forEach((card, index) => {
				if (index === 0) return;
				tl.to(
					cards[index - 1],
					{ autoAlpha: 0, y: -48, duration: 0.3, ease: 'power1.in' },
					index - 0.3
				);
				tl.to(
					card,
					{ autoAlpha: 1, y: 0, duration: 0.3, ease: 'power1.out' },
					index
				);
			});

			tl.to({}, { duration: 1 }, count - 1);

			let rafId = 0;
			const resizeObserver = new ResizeObserver(() => {
				cancelAnimationFrame(rafId);
				rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
			});
			resizeObserver.observe(document.body);

			return () => {
				cancelAnimationFrame(rafId);
				resizeObserver.disconnect();
			};
		});

		return () => mm.revert();
	}, [sortedExperiences]);

	if (sortedExperiences.length === 0) {
		return null;
	}

	const activeExperience = sortedExperiences[activeIndex];
	const count = sortedExperiences.length;

	const nodeClassName = (index: number): string =>
		[
			styles.HomeCareer__node,
			index <= activeIndex ? styles['HomeCareer__node--passed'] : '',
			index === activeIndex ? styles['HomeCareer__node--active'] : '',
		].join(' ');

	return (
		<section id="career" className={`${styles.HomeCareer} ${className}`}>
			<div ref={pinRef} className={styles.HomeCareer__pin}>
				<div className={styles.HomeCareer__intro}>
					<h2>
						<MaskText phrases={[data.title || 'Career Journey']} />
					</h2>
					{data.subtitle && <p>{data.subtitle}</p>}
				</div>
				<div ref={stageRef} className={styles.HomeCareer__stage}>
					<div className={styles.HomeCareer__meta}>
						<span className={styles.HomeCareer__counter}>
							{String(activeIndex + 1).padStart(2, '0')}
							<span className={styles.HomeCareer__counterTotal}>
								&nbsp;/ {String(sortedExperiences.length).padStart(2, '0')}
							</span>
						</span>
						<div className={styles.HomeCareer__year}>
							{activeExperience.year.split('').map((char, index) => (
								<span key={index} className={styles.HomeCareer__yearDigit}>
									<AnimatePresence initial={false}>
										<motion.span
											key={char}
											initial={{ y: '100%' }}
											animate={{ y: 0 }}
											exit={{ y: '-100%' }}
											transition={{
												duration: 0.4,
												ease: [0.76, 0, 0.24, 1],
											}}
										>
											{char}
										</motion.span>
									</AnimatePresence>
								</span>
							))}
						</div>
						<span className={styles.HomeCareer__company}>
							{activeExperience.company}
						</span>
					</div>
					<div className={styles.HomeCareer__stepper} aria-hidden="true">
						<span
							ref={stepperFillRef}
							className={styles.HomeCareer__stepperFill}
						/>
						{sortedExperiences.map((experience, index) => (
							<span
								key={experience.id}
								className={nodeClassName(index)}
								style={{
									left: count > 1 ? `${(index / (count - 1)) * 100}%` : '50%',
									top: '50%',
								}}
							/>
						))}
					</div>
					<div className={styles.HomeCareer__rail} aria-hidden="true">
						<svg
							viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
							preserveAspectRatio="none"
						>
							<path className={styles.HomeCareer__railTrack} d={pathD} />
							<path
								ref={pathRef}
								className={styles.HomeCareer__railProgress}
								d={pathD}
							/>
						</svg>
						{nodes.map((node, index) => (
							<span
								key={sortedExperiences[index].id}
								className={nodeClassName(index)}
								style={{
									left: `${(node.x / VIEWBOX_WIDTH) * 100}%`,
									top: `${(node.y / VIEWBOX_HEIGHT) * 100}%`,
								}}
							/>
						))}
					</div>
					<div className={styles.HomeCareer__cards}>
						{sortedExperiences.map((experience) => (
							<div
								key={experience.id}
								data-career-card
								className={styles.HomeCareer__card}
							>
								<span className={styles.HomeCareer__cardYear}>
									{experience.year}
								</span>
								<CareerCard experience={experience} />
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeCareer;
