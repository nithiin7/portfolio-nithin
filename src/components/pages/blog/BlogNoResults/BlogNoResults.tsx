'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';

import { SearchIcon } from 'assets/icons';

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
				<SearchIcon size={64} />
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
