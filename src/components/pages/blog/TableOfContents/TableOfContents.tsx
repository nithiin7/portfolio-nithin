'use client';
import { useLenis } from 'lenis/react';
import {
	useEffect,
	useState,
	type FC,
	type MouseEvent,
	type ReactElement,
} from 'react';

import type { TocItem } from 'helpers/richText';
import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';

import styles from './TableOfContents.module.scss';

interface TableOfContentsProps {
	items: TocItem[];
	variant: 'rail' | 'inline';
	className?: string;
}

const pad = (n: number): string => String(n).padStart(2, '0');

const TableOfContents: FC<TableOfContentsProps> = ({
	items,
	variant,
	className,
}): ReactElement | null => {
	const [active, setActive] = useState<string | undefined>(items[0]?.id);
	const reduced = usePrefersReducedMotion();
	const lenis = useLenis();

	useEffect(() => {
		const targets = items
			.map(({ id }) => document.getElementById(id))
			.filter((el): el is HTMLElement => el !== null);

		const observer = new IntersectionObserver(
			(entries) => {
				const hit = entries.find((entry) => entry.isIntersecting);
				if (hit) setActive(hit.target.id);
			},
			{ rootMargin: '-15% 0px -70% 0px' }
		);
		targets.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [items]);

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
		setActive(id);
	};

	if (items.length === 0) return null;

	let section = 0;
	const list = (
		<ol className={styles.TableOfContents__list}>
			{items.map((item) => {
				if (item.level === 2) section += 1;
				return (
					<li key={item.id} data-level={item.level}>
						<a
							href={`#${item.id}`}
							className={styles.TableOfContents__link}
							aria-current={item.id === active ? 'location' : undefined}
							onClick={(event) => jump(event, item.id)}
						>
							{item.level === 2 && (
								<span className={styles.TableOfContents__count}>
									{pad(section)}
								</span>
							)}
							<span>{item.text}</span>
						</a>
					</li>
				);
			})}
		</ol>
	);

	const classes = [styles.TableOfContents, className].filter(Boolean).join(' ');

	if (variant === 'inline') {
		return (
			<details className={classes} data-variant="inline">
				<summary className={styles.TableOfContents__summary}>
					Contents{' '}
					<span className={styles.TableOfContents__total}>
						({pad(items.length)})
					</span>
				</summary>
				<nav aria-label="Article contents">{list}</nav>
			</details>
		);
	}

	return (
		<nav className={classes} data-variant="rail" aria-label="Article contents">
			<p className={styles.TableOfContents__title} aria-hidden="true">
				Contents
			</p>
			{list}
		</nav>
	);
};

export default TableOfContents;
