'use client';
import {
	motion,
	useAnimationFrame,
	useInView,
	useMotionValue,
	useScroll,
	useVelocity,
} from 'motion/react';
import {
	useEffect,
	useRef,
	useState,
	type FC,
	type FocusEvent,
	type ReactElement,
} from 'react';

import ScrambleText from 'components/motion/ScrambleText/ScrambleText';
import CompanyLogo from 'components/utilities/CompanyLogo/CompanyLogo';
import { useLiteMotion } from 'hooks/useLiteMotion';
import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';
import type { Company } from 'types/company';

import styles from './HomeCollaborations.module.scss';

interface HomeCollaborationsProps {
	className?: string;
	data?: {
		title?: string;
	};
	collaborators?: Company[];
}

const MAX_BOOST = 3;
const LOOP_SECONDS = 48;
const EASE_MS = 220;

const HomeCollaborations: FC<HomeCollaborationsProps> = ({
	className = '',
	data,
	collaborators = [],
}): ReactElement => {
	const marqueeRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const [paused, setPaused] = useState(false);
	const [held, setHeld] = useState(false);
	const lite = useLiteMotion();
	const reducedMotion = usePrefersReducedMotion();
	const inView = useInView(marqueeRef);

	const { scrollY } = useScroll();
	const velocity = useVelocity(scrollY);
	const x = useMotionValue(0);
	const progress = useRef(0);
	const rate = useRef(1);
	const loopWidth = useRef(0);

	useEffect(() => {
		const list = listRef.current;
		if (!list) return;
		const measure = (): void => {
			loopWidth.current = list.offsetWidth;
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(list);
		return () => observer.disconnect();
	}, []);

	useAnimationFrame((_, delta) => {
		if (reducedMotion || !inView || !loopWidth.current) return;
		const dt = Math.min(delta, 100);
		const boost = lite
			? 0
			: Math.min(
					Math.abs(velocity.get()) / (window.innerHeight * 1.6),
					MAX_BOOST
				);
		const target = paused || held ? 0 : 1 + boost;
		rate.current += (target - rate.current) * (1 - Math.exp(-dt / EASE_MS));
		progress.current =
			(progress.current + (dt / 1000 / LOOP_SECONDS) * rate.current) % 1;
		x.set(-progress.current * loopWidth.current);
	});

	const handleBlur = (e: FocusEvent<HTMLDivElement>): void => {
		if (!e.currentTarget.contains(e.relatedTarget as Node | null))
			setHeld(false);
	};

	const renderLogos = (copy: boolean) =>
		collaborators.map((company) => (
			<li key={company.slug} className={styles.HomeCollaborations__item}>
				<CompanyLogo
					company={company}
					size="lg"
					linked
					className={styles.HomeCollaborations__logo}
					tabIndex={copy ? -1 : undefined}
				/>
			</li>
		));

	return (
		<section
			id="collaborations"
			className={`${styles.HomeCollaborations} ${className}`}
		>
			<div className={styles.HomeCollaborations__inner}>
				<header className={styles.HomeCollaborations__head}>
					<p className={styles.HomeCollaborations__label}>Collaborations</p>
					<h2 className={styles.HomeCollaborations__title}>
						<span className={styles.HomeCollaborations__number}>
							{String(collaborators.length).padStart(2, '0')}
						</span>{' '}
						<ScrambleText
							as="span"
							text={data?.title || 'Brands I’ve built for.'}
						/>
					</h2>
					<button
						type="button"
						className={styles.HomeCollaborations__toggle}
						aria-pressed={paused}
						onClick={() => setPaused((p) => !p)}
					>
						{paused ? 'Play' : 'Pause'}
						<span className={styles.HomeCollaborations__srOnly}>
							{' '}
							logo marquee
						</span>
					</button>
				</header>
			</div>

			<div
				ref={marqueeRef}
				className={styles.HomeCollaborations__marquee}
				onPointerMove={(e) => {
					if (e.pointerType === 'mouse' && (e.movementX || e.movementY))
						setHeld(true);
				}}
				onPointerLeave={(e) => {
					if (e.pointerType === 'mouse') setHeld(false);
				}}
				onFocus={() => setHeld(true)}
				onBlur={handleBlur}
			>
				<motion.div
					className={styles.HomeCollaborations__track}
					style={reducedMotion ? undefined : { x }}
				>
					<ul ref={listRef} className={styles.HomeCollaborations__list}>
						{renderLogos(false)}
					</ul>
					<ul
						className={`${styles.HomeCollaborations__list} ${styles['HomeCollaborations__list--copy']}`}
						aria-hidden="true"
					>
						{renderLogos(true)}
					</ul>
				</motion.div>
			</div>
		</section>
	);
};

export default HomeCollaborations;
