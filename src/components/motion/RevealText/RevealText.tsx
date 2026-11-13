'use client';

import {
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type FC,
	type ReactElement,
} from 'react';
import { useInView } from 'react-intersection-observer';

import { useRevealOnMount } from 'components/motion/useRevealOnMount';

import styles from './RevealText.module.scss';

type RevealTextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

export interface RevealTextProps {
	children: string;
	as?: RevealTextTag;
	className?: string;
	/** Seconds before the first line starts. */
	delay?: number;
	/** Seconds between consecutive lines. */
	stagger?: number;
	/** `inView` waits for the element to scroll into view; `mount` plays immediately. */
	trigger?: 'inView' | 'mount';
	/** Replay when the element re-enters the viewport. */
	once?: boolean;
	/** Fraction of the element that must be visible before revealing. */
	amount?: number;
}

const groupIntoLines = (words: HTMLElement[]): number[] => {
	const tops: number[] = [];
	return words.map((word) => {
		const top = word.offsetTop;
		let line = tops.findIndex((t) => Math.abs(t - top) < 2);
		if (line === -1) {
			tops.push(top);
			line = tops.length - 1;
		}
		return line;
	});
};

/**
 * Line-by-line mask reveal. Lines are found by measuring where the browser
 * actually wrapped each word, so the effect survives any width or font size.
 * Under prefers-reduced-motion the text is rendered static (CSS-only, so SSR
 * and hydration markup never diverge).
 */
const RevealText: FC<RevealTextProps> = ({
	children,
	as: Tag = 'p',
	className,
	delay = 0,
	stagger = 0.08,
	trigger = 'inView',
	once = true,
	amount = 0.4,
}): ReactElement => {
	const words = children.trim().split(/\s+/);
	const wordRefs = useRef<HTMLElement[]>([]);
	const rootRef = useRef<HTMLElement | null>(null);
	const [lines, setLines] = useState<number[]>([]);

	const { ref: inViewRef, inView } = useInView({
		threshold: amount,
		triggerOnce: once,
		skip: trigger !== 'inView',
	});
	const mounted = useRevealOnMount(trigger === 'mount');
	const revealed = trigger === 'mount' ? mounted : inView;

	const setRootRef = useCallback(
		(node: HTMLElement | null) => {
			rootRef.current = node;
			inViewRef(node);
		},
		[inViewRef]
	);

	useLayoutEffect(() => {
		const root = rootRef.current;
		if (!root) return;

		const measure = (): void => setLines(groupIntoLines(wordRefs.current));
		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(root);
		return () => observer.disconnect();
	}, [children]);

	return (
		<Tag
			ref={setRootRef}
			className={[styles.RevealText, className].filter(Boolean).join(' ')}
			data-revealed={revealed}
			style={
				{
					'--reveal-delay': `${delay}s`,
					'--reveal-stagger': `${stagger}s`,
				} as CSSProperties
			}
		>
			<span className={styles.RevealText__sr}>{children}</span>
			<span aria-hidden="true">
				{words.map((word, i) => (
					<span key={`${word}-${i}`}>
						<span className={styles.RevealText__mask}>
							<span
								ref={(node) => {
									if (node) wordRefs.current[i] = node;
								}}
								className={styles.RevealText__word}
								style={{ '--line': lines[i] ?? 0 } as CSSProperties}
							>
								{word}
							</span>
						</span>
						{i < words.length - 1 ? ' ' : null}
					</span>
				))}
			</span>
		</Tag>
	);
};

export default RevealText;
