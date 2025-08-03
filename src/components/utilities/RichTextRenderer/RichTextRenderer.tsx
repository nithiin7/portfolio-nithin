'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';

import styles from './RichTextRenderer.module.scss';

interface RichTextRendererProps {
	content: string;
	className?: string;
}

/**
 * RichTextRenderer component for rendering Contentful rich text content
 * with proper styling and animations
 */
const RichTextRenderer: FC<RichTextRendererProps> = ({
	content,
	className,
}) => {
	return (
		<motion.div
			className={`${styles.richText} ${className || ''}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
		>
			<div
				className={styles.richText__content}
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</motion.div>
	);
};

export default RichTextRenderer;
