'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';

import styles from './BlogNoResults.module.scss';

/**
 * BlogNoResults component displayed when search returns no results
 */
const BlogNoResults: FC = () => {
	return (
		<motion.div
			className={styles.BlogNoResults}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
		>
			<div className={styles.BlogNoResults__icon}>
				<svg
					width="64"
					height="64"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
			<h3 className={styles.BlogNoResults__title}>No articles found</h3>
			<p className={styles.BlogNoResults__text}>
				Try adjusting your search terms or filters to find what you're looking
				for.
			</p>
			<motion.button
				className={styles.BlogNoResults__button}
				onClick={() => window.location.reload()}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				Clear filters
			</motion.button>
		</motion.div>
	);
};

export default BlogNoResults;
