import { motion } from 'motion/react';
import type { FC } from 'react';

import styles from './Tag.module.scss';

export interface TagProps {
	children: React.ReactNode;
	className?: string;
	variant?: 'default' | 'primary' | 'secondary' | 'accent';
	size?: 'small' | 'medium' | 'large';
	animated?: boolean;
	delay?: number;
}

/**
 * Reusable Tag component with animations and variants
 */
const Tag: FC<TagProps> = ({
	children,
	className = '',
	variant = 'default',
	size = 'medium',
	animated = true,
	delay = 0,
}) => {
	const baseClass = styles.Tag;
	const variantClass = styles[`Tag__${variant}`];
	const sizeClass = styles[`Tag__${size}`];
	const combinedClass =
		`${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

	if (animated) {
		return (
			<motion.span
				className={combinedClass}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4, delay }}
			>
				{children}
			</motion.span>
		);
	}

	return <span className={combinedClass}>{children}</span>;
};

export default Tag;
