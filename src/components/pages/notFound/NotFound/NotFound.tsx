'use client';
import Link from 'next/link';
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
	type FC,
	type ReactElement,
} from 'react';

import RevealText from 'components/motion/RevealText/RevealText';
import ScrambleText from 'components/motion/ScrambleText/ScrambleText';
import { navLinks } from 'constants/index';
import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';
import type { LinkItem } from 'types/utils';

import styles from './NotFound.module.scss';

const ROUTES: LinkItem[] = [{ title: 'Home', href: '/' }, ...navLinks];
const LERP = 0.14;

const noopSubscribe = (): (() => void) => () => {};

const pad = (n: number): string => String(n).padStart(2, '0');

export const closestRoute = (pathname: string, routes: LinkItem[]): number => {
	const segment = pathname.split('/')[1]?.toLowerCase() ?? '';
	if (!segment) return -1;
	return routes.findIndex((route) => {
		const target = route.href.replace(/^\/#?/, '').split('/')[0] ?? '';
		return (
			target !== '' &&
			(segment.startsWith(target) || target.startsWith(segment))
		);
	});
};

const NotFound: FC = (): ReactElement => {
	const pathname = useSyncExternalStore(
		noopSubscribe,
		() => window.location.pathname,
		() => ''
	);
	const reducedMotion = usePrefersReducedMotion();
	const [current, setCurrent] = useState<number | null>(null);
	const frameRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const target = useRef({ x: 0, y: 0 });
	const position = useRef({ x: 0, y: 0 });
	const raf = useRef<number | null>(null);
	const suggested = closestRoute(pathname, ROUTES);

	const tick = useCallback((): void => {
		const pos = position.current;
		const { x, y } = target.current;
		const k = reducedMotion ? 1 : LERP;
		pos.x += (x - pos.x) * k;
		pos.y += (y - pos.y) * k;
		if (frameRef.current) {
			frameRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
		}
		const settled = Math.abs(x - pos.x) < 0.1 && Math.abs(y - pos.y) < 0.1;
		raf.current = settled ? null : requestAnimationFrame(tick);
	}, [reducedMotion]);

	const moveTo = useCallback(
		(x: number, y: number, snap = false): void => {
			target.current = { x, y };
			if (snap) position.current = { x, y };
			raf.current ??= requestAnimationFrame(tick);
		},
		[tick]
	);

	useEffect(() => {
		const onPointerMove = (e: PointerEvent): void => {
			if (e.pointerType === 'mouse') moveTo(e.clientX, e.clientY);
		};
		window.addEventListener('pointermove', onPointerMove, { passive: true });
		return () => {
			window.removeEventListener('pointermove', onPointerMove);
			if (raf.current !== null) cancelAnimationFrame(raf.current);
			raf.current = null;
		};
	}, [moveTo]);

	useEffect(() => {
		const list = listRef.current;
		if (!list) return undefined;
		const close = (): void => setCurrent(null);
		list.addEventListener('pointerleave', close);
		return () => list.removeEventListener('pointerleave', close);
	}, []);

	const open = (index: number, anchor?: HTMLElement): void => {
		if (anchor) {
			const rect = anchor.getBoundingClientRect();
			moveTo(
				rect.left + rect.width * 0.6,
				rect.top + rect.height / 2,
				current === null
			);
		} else if (current === null) {
			moveTo(target.current.x, target.current.y, true);
		}
		setCurrent(index);
	};

	return (
		<div className={styles.NotFound}>
			<header className={styles.NotFound__hero}>
				<div className={styles.NotFound__topline}>
					<p className={styles.NotFound__mono}>Error 404</p>
					<p className={styles.NotFound__mono}>
						GET <span className={styles.NotFound__path}>{pathname || '…'}</span>
					</p>
				</div>
				<p className={styles.NotFound__code} aria-hidden="true">
					4<span className={styles.NotFound__zero}>0</span>4
				</p>
				<ScrambleText
					as="h1"
					duration={0.8}
					className={styles.NotFound__title}
					text="This page isn’t in the index."
				/>
				<RevealText
					as="p"
					trigger="mount"
					delay={0.2}
					className={styles.NotFound__lede}
				>
					Whatever lived here moved, was renamed, or never shipped. These pages
					did.
				</RevealText>
			</header>

			<nav className={styles.NotFound__inner} aria-label="Pages that exist">
				<ul
					ref={listRef}
					className={styles.NotFound__list}
					data-active={current !== null}
				>
					{ROUTES.map((route, index) => (
						<li
							key={route.href}
							className={styles.NotFound__item}
							data-current={current === index}
						>
							<Link
								href={route.href}
								className={styles.NotFound__row}
								onMouseEnter={() => open(index)}
								onFocus={(e) => open(index, e.currentTarget)}
								onBlur={() => setCurrent(null)}
							>
								<span className={styles.NotFound__number}>
									{pad(index + 1)}
								</span>
								<span className={styles.NotFound__titleCell}>
									<span className={styles.NotFound__rowTitle}>
										{route.title}
									</span>
								</span>
								<span className={styles.NotFound__href}>
									{index === suggested && (
										<span className={styles.NotFound__match}>
											Closest match
										</span>
									)}
									{route.href}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>

			<div
				ref={frameRef}
				className={styles.NotFound__preview}
				aria-hidden="true"
			>
				<div className={styles.NotFound__window} data-open={current !== null}>
					{ROUTES.map((route, index) => (
						<div
							key={route.href}
							className={styles.NotFound__layer}
							data-state={current === index ? 'active' : 'idle'}
						>
							<svg
								className={styles.NotFound__cross}
								viewBox="0 0 100 75"
								preserveAspectRatio="none"
							>
								<line x1="0" y1="0" x2="100" y2="75" />
								<line x1="100" y1="0" x2="0" y2="75" />
							</svg>
							<span className={styles.NotFound__fpo}>FPO</span>
							<span className={styles.NotFound__caption}>
								Fig. {pad(index + 1)}: image not found either
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default NotFound;
