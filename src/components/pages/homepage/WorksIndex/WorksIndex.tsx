'use client';
import Link from 'next/link';
import type { FC, FocusEvent, KeyboardEvent, ReactElement } from 'react';
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	ViewTransition,
} from 'react';

import WorksMedia from 'components/pages/homepage/WorksMedia/WorksMedia';
import WorksPreview from 'components/pages/homepage/WorksPreview/WorksPreview';
import type { WorksPreviewState } from 'components/pages/homepage/WorksPreview/WorksPreview';
import { portfolioHref } from 'helpers/portfolio';
import { useMediaQuery } from 'hooks/useMediaQuery';
import type { PortfolioItem } from 'types/portfolio';

import styles from './WorksIndex.module.scss';

interface WorksIndexProps {
	projects: PortfolioItem[];
	/** Number of projects shown before this list, so numbering continues. */
	offset?: number;
}

const INITIAL_PREVIEW: WorksPreviewState = {
	current: null,
	previous: null,
	seen: new Set(),
	anchor: null,
};

const WorksIndex: FC<WorksIndexProps> = ({
	projects,
	offset = 0,
}): ReactElement => {
	const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
	const [preview, setPreview] = useState<WorksPreviewState>(INITIAL_PREVIEW);
	const [tabStop, setTabStop] = useState(0);
	const links = useRef<(HTMLAnchorElement | null)[]>([]);
	const listRef = useRef<HTMLUListElement>(null);

	const activate = useCallback(
		(index: number, anchor: HTMLElement | null) =>
			setPreview((prev) => {
				if (prev.current === index && prev.anchor === anchor) return prev;
				const seen = prev.seen.has(index)
					? prev.seen
					: new Set(prev.seen).add(index);
				return {
					current: index,
					previous: prev.current ?? prev.previous,
					seen,
					anchor,
				};
			}),
		[]
	);

	const deactivate = useCallback(
		() =>
			setPreview((prev) =>
				prev.current === null
					? prev
					: { ...prev, current: null, previous: prev.current, anchor: null }
			),
		[]
	);

	useEffect(() => {
		const list = listRef.current;
		if (!list) return;
		const onPointerLeave = (e: PointerEvent): void => {
			if (e.pointerType === 'mouse') deactivate();
		};
		list.addEventListener('pointerleave', onPointerLeave);
		return () => list.removeEventListener('pointerleave', onPointerLeave);
	}, [deactivate]);

	const handleKeyDown = (
		e: KeyboardEvent<HTMLAnchorElement>,
		from: number
	): void => {
		const count = projects.length;

		const next = {
			ArrowDown: (from + 1) % count,
			ArrowUp: (from - 1 + count) % count,
			Home: 0,
			End: count - 1,
		}[e.key];
		if (next === undefined) return;

		e.preventDefault();
		links.current[next]?.focus();
	};

	const handleBlur = (e: FocusEvent<HTMLAnchorElement>): void => {
		if (!listRef.current?.contains(e.relatedTarget as Node | null))
			deactivate();
	};

	const isActive = preview.current !== null;
	const hasType = projects.some((project) => project.type);

	return (
		<div className={styles.WorksIndex} data-has-type={hasType}>
			<div className={styles.WorksIndex__head} aria-hidden="true">
				<span className={styles.WorksIndex__colNumber}>No.</span>
				<span className={styles.WorksIndex__colTitle}>Project</span>
				{hasType && <span className={styles.WorksIndex__colType}>Type</span>}
				<span className={styles.WorksIndex__colYear}>Year</span>
				<span className={styles.WorksIndex__colStack}>Stack</span>
			</div>
			<ul
				ref={listRef}
				className={styles.WorksIndex__list}
				data-active={isActive}
				aria-label="All projects. Use arrow keys to move between projects."
			>
				{projects.map((project, index) => {
					const position = offset + index;
					const id = project.id ?? position + 1;
					return (
						<li
							key={project.id ?? project.title}
							className={styles.WorksIndex__item}
							data-current={preview.current === index}
						>
							<Link
								ref={(el) => {
									links.current[index] = el;
								}}
								href={portfolioHref(project)}
								className={styles.WorksIndex__row}
								tabIndex={index === tabStop ? 0 : -1}
								onKeyDown={(e) => handleKeyDown(e, index)}
								onBlur={handleBlur}
								onPointerEnter={(e) => {
									if (e.pointerType === 'mouse') activate(index, null);
								}}
								onFocus={(e) => {
									setTabStop(index);
									// Click focus must not yank the preview off the cursor mid-navigation
									if (e.currentTarget.matches(':focus-visible'))
										activate(index, e.currentTarget);
								}}
							>
								<span className={styles.WorksIndex__thumb}>
									<WorksMedia project={project} sizes="100vw" />
								</span>
								<span
									className={styles.WorksIndex__colNumber}
									aria-hidden="true"
								>
									{String(position + 1).padStart(2, '0')}
								</span>
								<span className={styles.WorksIndex__colTitle}>
									<ViewTransition
										name={`portfolio-title-${id}`}
										share="portfolio-title-morph"
										enter="none"
										exit="none"
										update="none"
									>
										<span className={styles.WorksIndex__title}>
											<span className={styles.WorksIndex__titleText}>
												{project.title}
											</span>
										</span>
									</ViewTransition>
								</span>
								{hasType && (
									<span className={styles.WorksIndex__colType}>
										{project.type}
									</span>
								)}
								<span className={styles.WorksIndex__colYear}>
									{project.year}
								</span>
								<span className={styles.WorksIndex__colStack}>
									{project.tech?.join(', ')}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
			{canHover && (
				<WorksPreview projects={projects} state={preview} offset={offset} />
			)}
		</div>
	);
};

export default WorksIndex;
