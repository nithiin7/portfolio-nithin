import { motion } from 'motion/react';
import type { FC, ReactNode } from 'react';

import styles from './TagContainer.module.scss';

export interface TagContainerProps {
	children: ReactNode;
	className?: string;
	animated?: boolean;
	delay?: number;
	justifyContent?:
		| 'flex-start'
		| 'center'
		| 'flex-end'
		| 'space-between'
		| 'space-around';
}

/**
 * Container component for grouping tags with consistent styling
 */
const TagContainer: FC<TagContainerProps> = ({
	children,
	className = '',
	animated = true,
	delay = 0,
	justifyContent = 'flex-start',
}) => {
	const combinedClass = `${styles.tagContainer} ${className}`.trim();
	const containerStyle = { justifyContent: justifyContent };

	if (animated) {
		return (
			<motion.div
				className={combinedClass}
				style={containerStyle}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay }}
			>
				{children}
			</motion.div>
		);
	}

	return (
		<div className={combinedClass} style={containerStyle}>
			{children}
		</div>
	);
};

export default TagContainer;
