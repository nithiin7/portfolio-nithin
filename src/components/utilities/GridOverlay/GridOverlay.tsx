'use client';

import { useEffect, useState, type FC, type ReactElement } from 'react';

import styles from './GridOverlay.module.scss';

const COLUMNS = 12;

const isEditable = (target: EventTarget | null): boolean =>
	target instanceof HTMLElement &&
	(target.isContentEditable ||
		['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

const GridOverlay: FC = (): ReactElement | null => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent): void => {
			if (event.key !== 'g' || event.metaKey || event.ctrlKey || event.altKey)
				return;
			if (isEditable(event.target)) return;
			setVisible((prev) => !prev);
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	if (!visible) return null;

	return (
		<div className={styles.GridOverlay} aria-hidden="true">
			<div className={styles.GridOverlay__grid}>
				{Array.from({ length: COLUMNS }, (_, i) => (
					<span key={i} className={styles.GridOverlay__col}>
						<span className={styles.GridOverlay__index}>{i + 1}</span>
					</span>
				))}
			</div>
		</div>
	);
};

export default GridOverlay;
