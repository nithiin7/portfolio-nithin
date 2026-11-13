'use client';
import {
	AnimatePresence,
	motion,
	useReducedMotion,
	type PanInfo,
	type Variants,
} from 'motion/react';
import Image from 'next/image';
import {
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	type FC,
	type KeyboardEvent,
	type ReactElement,
} from 'react';

import ScrambleText from 'components/motion/ScrambleText/ScrambleText';
import { duration, ease } from 'styles/tokens';
import type { Testimonial } from 'types/testimony';

import styles from './HomeTestimonial.module.scss';

interface HomeTestimonialProps {
	className?: string;
	data?: {
		title?: string;
	};
	testimonial?: Testimonial[];
	/** Milliseconds between slides. Off unless set; never runs under reduced motion. */
	autoAdvance?: number;
}

const SWIPE_THRESHOLD = 80;
const OFFSET = 64;
const LONG_QUOTE = 220;

const slide: Variants = {
	enter: (dir: number) => ({ x: dir * OFFSET, opacity: 0 }),
	center: { x: 0, opacity: 1 },
	exit: (dir: number) => ({ x: dir * -OFFSET, opacity: 0 }),
};

const fade: Variants = {
	enter: { opacity: 0 },
	center: { opacity: 1 },
	exit: { opacity: 0 },
};

const pad = (n: number): string => String(n).padStart(2, '0');

// Contentful reviews carry their own straight quotes; the section draws one
// typographic mark instead.
const unquote = (text: string): string =>
	text.trim().replace(/^["“]+|["”]+$/g, '');

const Quote: FC<{ item: Testimonial }> = ({ item }) => (
	<>
		<blockquote
			className={`${styles.HomeTestimonial__quote} ${
				item.review.length > LONG_QUOTE
					? styles['HomeTestimonial__quote--long']
					: ''
			}`}
		>
			<p>{unquote(item.review)}</p>
		</blockquote>
		<figcaption className={styles.HomeTestimonial__author}>
			{item.avatar?.url && (
				<Image
					className={styles.HomeTestimonial__avatar}
					src={item.avatar.url}
					alt=""
					width={96}
					height={96}
					sizes="(min-width: 1920px) 3vw, (min-width: 768px) 56px, 48px"
				/>
			)}
			<span className={styles.HomeTestimonial__meta}>
				<cite className={styles.HomeTestimonial__name}>{item.reviewer}</cite>
				<span className={styles.HomeTestimonial__institution}>
					{[item.role, item.organisation].filter(Boolean).join(', ')}
				</span>
			</span>
		</figcaption>
	</>
);

const HomeTestimonial: FC<HomeTestimonialProps> = ({
	className = '',
	data,
	testimonial = [],
	autoAdvance = 0,
}): ReactElement | null => {
	const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
	const [held, setHeld] = useState(false);
	const reduced = useReducedMotion();
	const titleId = useId();
	const sectionRef = useRef<HTMLElement>(null);
	const count = testimonial.length;

	const go = useCallback(
		(dir: number) => setSlide(([i]) => [(i + dir + count) % count, dir]),
		[count]
	);

	const goTo = (target: number) =>
		setSlide(([i]) => [target, target === i ? 0 : target > i ? 1 : -1]);

	const rotating = autoAdvance > 0 && !reduced && count > 1;

	useEffect(() => {
		const node = sectionRef.current;
		if (!rotating || !node) return;
		const hold = () => setHeld(true);
		const release = () => setHeld(false);
		const events = [
			['pointerenter', hold],
			['pointerleave', release],
			['focusin', hold],
			['focusout', release],
		] as const;
		events.forEach(([type, fn]) => node.addEventListener(type, fn));
		return () =>
			events.forEach(([type, fn]) => node.removeEventListener(type, fn));
	}, [rotating]);

	useEffect(() => {
		if (!rotating || held) return;
		const timer = window.setInterval(() => go(1), autoAdvance);
		return () => window.clearInterval(timer);
	}, [rotating, held, autoAdvance, go]);

	const current = testimonial[index];
	if (!current) return null;
	const multiple = count > 1;

	const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
		const swipe = offset.x + velocity.x * 0.2;
		if (swipe < -SWIPE_THRESHOLD) go(1);
		else if (swipe > SWIPE_THRESHOLD) go(-1);
	};

	const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'ArrowRight') go(1);
		if (event.key === 'ArrowLeft') go(-1);
	};

	return (
		<section
			id="testimonials"
			className={`${styles.HomeTestimonial} ${className}`}
			aria-roledescription="carousel"
			aria-labelledby={titleId}
			ref={sectionRef}
		>
			<div className={styles.HomeTestimonial__inner}>
				<header className={styles.HomeTestimonial__head}>
					<p className={styles.HomeTestimonial__label}>Testimonials</p>
					<h2 id={titleId} className={styles.HomeTestimonial__title}>
						<ScrambleText as="span" text={data?.title || 'Kind words.'} />
					</h2>
				</header>

				<div className={styles.HomeTestimonial__body}>
					<span className={styles.HomeTestimonial__mark} aria-hidden="true">
						“
					</span>

					<div
						className={styles.HomeTestimonial__stage}
						aria-live={rotating ? 'off' : 'polite'}
					>
						{testimonial.map((item, i) => (
							<figure
								key={`sizer-${item.id}-${i}`}
								className={`${styles.HomeTestimonial__figure} ${styles.HomeTestimonial__sizer}`}
								aria-hidden="true"
							>
								<Quote item={item} />
							</figure>
						))}
						<AnimatePresence initial={false} custom={direction}>
							<motion.div
								key={index}
								className={`${styles.HomeTestimonial__slide} ${
									multiple ? styles['HomeTestimonial__slide--draggable'] : ''
								}`}
								role="group"
								aria-roledescription="slide"
								aria-label={`${index + 1} of ${count}`}
								custom={direction}
								variants={reduced ? fade : slide}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									duration: reduced ? 0 : duration.base,
									ease,
								}}
								drag={multiple ? 'x' : false}
								dragConstraints={{ left: 0, right: 0 }}
								dragElastic={0.35}
								dragSnapToOrigin
								onDragEnd={onDragEnd}
							>
								<figure className={styles.HomeTestimonial__figure}>
									<Quote item={current} />
								</figure>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>

				{multiple && (
					<div className={styles.HomeTestimonial__controls}>
						<ol className={styles.HomeTestimonial__pages}>
							{testimonial.map((item, i) => (
								<li key={`page-${item.id}-${i}`}>
									<button
										type="button"
										className={styles.HomeTestimonial__page}
										aria-current={i === index ? 'true' : undefined}
										onClick={() => goTo(i)}
										onKeyDown={onKeyDown}
									>
										<span className={styles.HomeTestimonial__srOnly}>
											Testimonial{' '}
										</span>
										{pad(i + 1)}
									</button>
								</li>
							))}
						</ol>
						<div className={styles.HomeTestimonial__arrows}>
							<button
								type="button"
								className={styles.HomeTestimonial__arrow}
								aria-label="Previous testimonial"
								onClick={() => go(-1)}
								onKeyDown={onKeyDown}
							>
								<span aria-hidden="true">←</span>
							</button>
							<button
								type="button"
								className={styles.HomeTestimonial__arrow}
								aria-label="Next testimonial"
								onClick={() => go(1)}
								onKeyDown={onKeyDown}
							>
								<span aria-hidden="true">→</span>
							</button>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default HomeTestimonial;
