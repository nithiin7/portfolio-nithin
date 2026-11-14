'use client';

import {
	motion,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from 'motion/react';
import { useEffect, useRef, useState, type FC, type ReactElement } from 'react';

import ScrambleText from 'components/motion/ScrambleText/ScrambleText';
import type { Manifesto } from 'types/home';

import styles from './HomeManifesto.module.scss';
import { manifestoFrame } from './sequence';

interface HomeManifestoProps {
	manifesto: Manifesto;
}

const pad = (value: number): string => String(value).padStart(2, '0');

const listFormat = new Intl.ListFormat('en-GB', {
	style: 'long',
	type: 'conjunction',
});

/** Pinned manifesto that cycles its lines on scroll. */
const HomeManifesto: FC<HomeManifestoProps> = ({ manifesto }): ReactElement => {
	const { before, after, words } = manifesto;
	const ref = useRef<HTMLElement>(null);
	const [index, setIndex] = useState(0);
	const count = words.length;

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start start', 'end end'],
	});
	const resolve = useTransform(
		scrollYProgress,
		(value) => manifestoFrame(value, count).resolve
	);

	useMotionValueEvent(scrollYProgress, 'change', (value) =>
		setIndex(manifestoFrame(value, count).index)
	);

	useEffect(() => {
		setIndex(manifestoFrame(scrollYProgress.get(), count).index);
	}, [scrollYProgress, count]);

	return (
		<section ref={ref} id="manifesto" className={styles.HomeManifesto}>
			<div className={styles.HomeManifesto__pin}>
				<div className={styles.HomeManifesto__inner}>
					<div className={styles.HomeManifesto__meta} aria-hidden="true">
						<span>Manifesto</span>
						<span className={styles.HomeManifesto__counter}>
							{pad(index + 1)} / {pad(count)}
						</span>
					</div>

					<h2 className={styles.HomeManifesto__statement}>
						<span className={styles.HomeManifesto__sr}>
							{`${before}${listFormat.format(words)}${after}`}
						</span>
						<span aria-hidden="true">
							<span className={styles.HomeManifesto__line}>
								{before.trim()}
							</span>
							<span className={styles.HomeManifesto__slot}>
								{words.map((word) => (
									<span key={word} className={styles.HomeManifesto__ghost}>
										{word}
									</span>
								))}
								<ScrambleText
									mode="scroll"
									text={words[index] ?? ''}
									progress={resolve}
									className={styles.HomeManifesto__word}
								/>
							</span>
							<span className={styles.HomeManifesto__line}>{after.trim()}</span>
						</span>
					</h2>

					<div className={styles.HomeManifesto__track} aria-hidden="true">
						<motion.span
							className={styles.HomeManifesto__fill}
							style={{ scaleX: scrollYProgress }}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeManifesto;
