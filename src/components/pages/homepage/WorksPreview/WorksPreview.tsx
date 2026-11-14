'use client';
import type { FC, ReactElement } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import WorksMedia from 'components/pages/homepage/WorksMedia/WorksMedia';
import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';
import type { PortfolioItem } from 'types/portfolio';

import styles from './WorksPreview.module.scss';

export interface WorksPreviewState {
	current: number | null;
	previous: number | null;
	anchor: HTMLElement | null;
}

interface WorksPreviewProps {
	projects: PortfolioItem[];
	state: WorksPreviewState;
	warm: boolean;
}

const LERP = 0.14;

const anchorPoint = (el: HTMLElement): { x: number; y: number } => {
	const rect = el.getBoundingClientRect();
	return { x: rect.left + rect.width * 0.6, y: rect.top + rect.height / 2 };
};

const layerState = (
	index: number,
	{ current, previous }: WorksPreviewState
): 'active' | 'previous' | 'idle' => {
	if (index === current) return 'active';
	if (index === previous) return 'previous';
	return 'idle';
};

const WorksPreview: FC<WorksPreviewProps> = ({
	projects,
	state,
	warm,
}): ReactElement => {
	const frameRef = useRef<HTMLDivElement>(null);
	const target = useRef({ x: 0, y: 0 });
	const position = useRef({ x: 0, y: 0 });
	const raf = useRef<number | null>(null);
	const reducedMotion = usePrefersReducedMotion();
	const open = state.current !== null;
	const wasOpen = useRef(false);

	const apply = useCallback((): void => {
		const frame = frameRef.current;
		if (!frame) return;
		const { x, y } = position.current;
		frame.style.transform = `translate3d(${x}px, ${y}px, 0)`;
	}, []);

	const tick = useCallback((): void => {
		const pos = position.current;
		const { x, y } = target.current;
		const k = reducedMotion ? 1 : LERP;
		pos.x += (x - pos.x) * k;
		pos.y += (y - pos.y) * k;
		apply();

		const settled = Math.abs(x - pos.x) < 0.1 && Math.abs(y - pos.y) < 0.1;
		raf.current = settled ? null : requestAnimationFrame(tick);
	}, [apply, reducedMotion]);

	const moveTo = useCallback(
		(x: number, y: number): void => {
			target.current = { x, y };
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

	useLayoutEffect(() => {
		if (state.anchor) {
			const { x, y } = anchorPoint(state.anchor);
			moveTo(x, y);
		}
		if (open && !wasOpen.current) {
			position.current = { ...target.current };
			apply();
		}
		wasOpen.current = open;
	}, [open, state.anchor, moveTo, apply]);

	return (
		<div ref={frameRef} className={styles.WorksPreview} aria-hidden="true">
			<div className={styles.WorksPreview__window} data-open={open}>
				{projects.map((project, index) => {
					if (!warm) return null;
					const layer = layerState(index, state);
					return (
						<div
							key={project.id ?? project.title}
							className={styles.WorksPreview__layer}
							data-state={layer}
						>
							<WorksMedia
								project={project}
								sizes="(min-width: 1920px) 22vw, (min-width: 1616px) 420px, (min-width: 1000px) 26vw, 260px"
								playing={open && layer === 'active'}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default WorksPreview;
