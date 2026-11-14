'use client';
import { motion, useScroll } from 'motion/react';
import {
	useEffect,
	useRef,
	type FC,
	type ReactElement,
	type ReactNode,
} from 'react';

import styles from './PostProgress.module.scss';

interface PostProgressProps {
	slug: string;
	children: ReactNode;
}

const PostProgress: FC<PostProgressProps> = ({
	slug,
	children,
}): ReactElement => {
	const bodyRef = useRef<HTMLDivElement>(null);
	const tracked = useRef<string | null>(null);
	const { scrollYProgress } = useScroll({
		target: bodyRef,
		offset: ['start 0.3', 'end end'],
	});

	useEffect(() => {
		if (tracked.current === slug) return;
		tracked.current = slug;
		fetch('/api/views', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ slug }),
		}).catch(() => {});
	}, [slug]);

	return (
		<div ref={bodyRef} className={styles.PostProgress}>
			<motion.span
				className={styles.PostProgress__bar}
				style={{ scaleX: scrollYProgress }}
				aria-hidden="true"
			/>
			{children}
		</div>
	);
};

export default PostProgress;
