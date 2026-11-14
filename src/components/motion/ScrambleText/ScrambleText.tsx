'use client';

import type { MotionValue } from 'motion/react';
import {
	useCallback,
	useLayoutEffect,
	useRef,
	type FC,
	type ReactElement,
} from 'react';

import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';

import {
	DEFAULT_GLYPHS,
	SWAP_INTERVAL_MS,
	resolveSchedule,
	scrambleFrame,
	toChars,
} from './scramble';
import styles from './ScrambleText.module.scss';

type ScrambleTextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

export type ScrambleMode = 'enter' | 'scroll' | 'hover';

export interface ScrambleTextProps {
	text: string;
	mode?: ScrambleMode;
	duration?: number;
	delay?: number;
	glyphs?: string;
	as?: ScrambleTextTag;
	className?: string;
	progress?: MotionValue<number>;
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const MONO_ADVANCE_EM = 0.6;
const GLYPH_SIZE_EM = 0.82;

/** Resolves text from scrambled glyphs on enter, hover or scroll. */
const ScrambleText: FC<ScrambleTextProps> = ({
	text,
	mode = 'enter',
	duration = 0.6,
	delay = 0,
	glyphs = DEFAULT_GLYPHS,
	as: Tag = 'span',
	className,
	progress,
}): ReactElement => {
	const rootRef = useRef<HTMLElement | null>(null);
	const reduced = usePrefersReducedMotion();

	const setRootRef = useCallback((node: HTMLElement | null) => {
		rootRef.current = node;
	}, []);

	useLayoutEffect(() => {
		const root = rootRef.current;
		if (!root) return;

		const cells = Array.from(root.querySelectorAll<HTMLElement>('[data-char]'));
		const clear = (): void => {
			for (const cell of cells) cell.removeAttribute('data-glyph');
		};
		const finish = (): void => {
			clear();
			root.dataset.state = 'done';
		};

		if (reduced || window.matchMedia(REDUCED_MOTION).matches) {
			finish();
			return;
		}

		let schedule = resolveSchedule(text);
		let frameId = 0;
		let lastSwap = Number.NEGATIVE_INFINITY;
		let inView = mode === 'hover';

		let fitted = false;
		const fit = (): void => {
			fitted = true;
			const first = cells[0];
			if (!first) return;
			const advance =
				MONO_ADVANCE_EM *
				GLYPH_SIZE_EM *
				Number.parseFloat(getComputedStyle(first).fontSize);
			const widths = cells.map((cell) => cell.getBoundingClientRect().width);
			cells.forEach((cell, i) => {
				const ratio = Math.min(1, (widths[i] ?? 0) / advance);
				cell.style.setProperty('--fit', ratio.toFixed(3));
			});
		};

		const paint = (value: number): void => {
			if (!fitted) fit();
			const frame = scrambleFrame(schedule, value, glyphs);
			frame.forEach((glyph, i) => {
				const cell = cells[i];
				if (!cell) return;
				if (glyph === null) cell.removeAttribute('data-glyph');
				else cell.setAttribute('data-glyph', glyph);
			});
		};

		const stop = (): void => {
			if (frameId) cancelAnimationFrame(frameId);
			frameId = 0;
		};

		if (mode === 'scroll') {
			const target = (): number => progress?.get() ?? 1;

			const tick = (now: number): void => {
				frameId = 0;
				const value = target();
				if (value >= 1) {
					finish();
					return;
				}
				if (now - lastSwap >= SWAP_INTERVAL_MS) {
					lastSwap = now;
					root.dataset.state = 'running';
					paint(value);
				}
				if (inView) frameId = requestAnimationFrame(tick);
			};
			const kick = (): void => {
				if (!frameId && inView) frameId = requestAnimationFrame(tick);
			};

			if (target() >= 1) finish();
			else {
				root.dataset.state = 'running';
				paint(target());
			}

			const observer = new IntersectionObserver(([entry]) => {
				inView = entry?.isIntersecting ?? false;
				if (inView) kick();
				else stop();
			});
			observer.observe(root);
			const unsubscribe = progress?.on('change', kick);

			return () => {
				stop();
				observer.disconnect();
				unsubscribe?.();
			};
		}

		const totalMs = Math.max(duration, 0.05) * 1000;
		const delayMs = Math.max(delay, 0) * 1000;
		let running = false;
		let elapsed = 0;
		let resumedAt = 0;

		const tick = (now: number): void => {
			frameId = 0;
			if (!running || !inView) return;
			if (now - lastSwap >= SWAP_INTERVAL_MS) {
				lastSwap = now;
				const t = (elapsed + now - resumedAt - delayMs) / totalMs;
				if (t >= 1) {
					running = false;
					finish();
					return;
				}
				paint(Math.max(t, 0));
			}
			frameId = requestAnimationFrame(tick);
		};

		const play = (): void => {
			if (running) return;
			schedule = resolveSchedule(text);
			fitted = false;
			running = true;
			elapsed = 0;
			resumedAt = performance.now();
			lastSwap = resumedAt;
			root.dataset.state = 'running';
			paint(0);
			frameId = requestAnimationFrame(tick);
		};

		if (mode === 'hover') {
			const host = root.closest<HTMLElement>('a, button') ?? root;
			const onPointerEnter = (event: PointerEvent): void => {
				if (event.pointerType !== 'touch') play();
			};
			const onFocusIn = (): void => {
				if (host.matches(':focus-visible')) play();
			};
			host.addEventListener('pointerenter', onPointerEnter);
			host.addEventListener('focusin', onFocusIn);
			return () => {
				stop();
				clear();
				host.removeEventListener('pointerenter', onPointerEnter);
				host.removeEventListener('focusin', onFocusIn);
			};
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				const now = performance.now();
				const visible = entry?.isIntersecting ?? false;
				if (visible === inView) return;
				inView = visible;
				if (!running) {
					if (visible && root.dataset.state !== 'done') play();
					return;
				}
				if (visible) {
					resumedAt = now;
					frameId = requestAnimationFrame(tick);
				} else {
					elapsed += now - resumedAt;
					stop();
				}
			},
			{ rootMargin: '0px 0px -10% 0px' }
		);
		observer.observe(root);

		return () => {
			stop();
			observer.disconnect();
			if (running) finish();
		};
	}, [text, mode, duration, delay, glyphs, progress, reduced]);

	return (
		<Tag
			ref={setRootRef}
			className={[styles.ScrambleText, className].filter(Boolean).join(' ')}
			data-mode={mode}
		>
			<span className={styles.ScrambleText__sr}>{text}</span>
			<span
				key={text}
				className={styles.ScrambleText__layer}
				aria-hidden="true"
			>
				{toChars(text).map((char, i) => (
					<span key={i} className={styles.ScrambleText__char} data-char="">
						{char}
					</span>
				))}
			</span>
		</Tag>
	);
};

export default ScrambleText;
