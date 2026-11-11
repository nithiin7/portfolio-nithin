'use client';
import { useLenis } from 'lenis/react';
import { motion, useScroll } from 'motion/react';
import {
	useEffect,
	useRef,
	useState,
	type FC,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
} from 'react';

import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';

import styles from './CaseStudyProgress.module.scss';

export interface CaseStudyProgressSection {
	id: string;
	label: string;
}

interface CaseStudyProgressProps {
	sections: CaseStudyProgressSection[];
	children: ReactNode;
}

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Sticky in-page progress. Desktop: a section rail with a hairline that fills
 * as you read. Below lg: a slim bar with the current section. The fill is
 * driven directly by scroll position, so it stays on under reduced motion.
 */
const CaseStudyProgress: FC<CaseStudyProgressProps> = ({
	sections,
	children,
}): ReactElement => {
	const bodyRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(sections[0]?.id);
	const reduced = usePrefersReducedMotion();
	const lenis = useLenis();
	const { scrollYProgress } = useScroll({
		target: bodyRef,
		offset: ['start 0.5', 'end 0.5'],
	});

	useEffect(() => {
		const root = bodyRef.current;
		if (!root) return;
		const targets = sections
			.map(({ id }) => root.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
			.filter((el): el is HTMLElement => el !== null);

		// A thin band across the middle of the viewport decides the active section
		const observer = new IntersectionObserver(
			(entries) => {
				const hit = entries.find((entry) => entry.isIntersecting);
				if (hit) setActive(hit.target.id);
			},
			{ rootMargin: '-45% 0px -50% 0px' }
		);
		targets.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [sections]);

	const jump = (event: MouseEvent<HTMLAnchorElement>, id: string): void => {
		const target = document.getElementById(id);
		if (!target) return;
		event.preventDefault();
		const offset = -(parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
		if (lenis) {
			lenis.scrollTo(target, { offset, immediate: reduced });
		} else {
			target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
		}
		target.focus({ preventScroll: true });
		history.replaceState(null, '', `#${id}`);
	};

	const activeIndex = Math.max(
		0,
		sections.findIndex((section) => section.id === active)
	);

	return (
		<div ref={bodyRef} className={styles.CaseStudyProgress}>
			<div className={styles.CaseStudyProgress__bar} aria-hidden="true">
				<span className={styles.CaseStudyProgress__barLabel}>
					<span className={styles.CaseStudyProgress__count}>
						{pad(activeIndex + 1)}/{pad(sections.length)}
					</span>
					{sections[activeIndex]?.label}
				</span>
				<motion.span
					className={styles.CaseStudyProgress__barFill}
					style={{ scaleX: scrollYProgress }}
				/>
			</div>

			<nav
				className={styles.CaseStudyProgress__rail}
				aria-label="Case study sections"
			>
				<span className={styles.CaseStudyProgress__track} aria-hidden="true">
					<motion.span
						className={styles.CaseStudyProgress__trackFill}
						style={{ scaleY: scrollYProgress }}
					/>
				</span>
				<ol className={styles.CaseStudyProgress__list}>
					{sections.map((section, index) => (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								className={styles.CaseStudyProgress__link}
								aria-current={section.id === active ? 'location' : undefined}
								onClick={(event) => jump(event, section.id)}
							>
								<span className={styles.CaseStudyProgress__count}>
									{pad(index + 1)}
								</span>
								{section.label}
							</a>
						</li>
					))}
				</ol>
			</nav>

			<div className={styles.CaseStudyProgress__content}>{children}</div>
		</div>
	);
};

export default CaseStudyProgress;
