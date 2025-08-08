'use client';
import { motion, AnimatePresence } from 'motion/react';
import type { FC } from 'react';
import { useState, useMemo, useEffect } from 'react';

import { SearchIcon } from 'assets/icons';
import type { BlogPost } from 'types/blog';

import styles from './BlogSearch.module.scss';

interface BlogSearchProps {
	posts: BlogPost[];
	onFilterChange: (filteredPosts: BlogPost[]) => void;
}

/**
 * BlogSearch component with horizontal category tabs and search functionality
 */
const BlogSearch: FC<BlogSearchProps> = ({ posts, onFilterChange }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('All');
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const allCategories = useMemo(() => {
		const categories = new Set<string>();
		posts.forEach((post) => {
			categories.add(post.category);
		});
		return ['All', ...Array.from(categories).sort()];
	}, [posts]);

	const filteredPosts = useMemo(() => {
		return posts.filter((post) => {
			const matchesSearch =
				searchTerm === '' ||
				post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
				post.category.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesCategory =
				selectedCategory === 'All' || post.category === selectedCategory;

			return matchesSearch && matchesCategory;
		});
	}, [posts, searchTerm, selectedCategory]);

	useEffect(() => {
		onFilterChange(filteredPosts);
	}, [filteredPosts, onFilterChange]);

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
	};

	const clearFilters = () => {
		setSearchTerm('');
		setSelectedCategory('All');
		setIsSearchOpen(false);
	};

	return (
		<motion.div
			className={styles.BlogSearch}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
		>
			<div className={styles.BlogSearch__container}>
				<div className={styles.BlogSearch__categories}>
					{allCategories.map((category, index) => (
						<motion.button
							key={category}
							className={`${styles.BlogSearch__category} ${
								selectedCategory === category
									? styles.BlogSearch__category_active
									: ''
							}`}
							onClick={() => handleCategoryChange(category)}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.3,
								delay: 0.4 + index * 0.05,
								ease: [0.33, 1, 0.68, 1],
							}}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							{category}
						</motion.button>
					))}
				</div>
				<motion.button
					className={styles.BlogSearch__search_toggle}
					onClick={() => setIsSearchOpen(!isSearchOpen)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
				>
					<SearchIcon size={20} />
				</motion.button>
			</div>
			<AnimatePresence>
				{isSearchOpen && (
					<motion.div
						className={styles.BlogSearch__search_container}
						initial={{ opacity: 0, scaleY: 0 }}
						animate={{ opacity: 1, scaleY: 1 }}
						exit={{ opacity: 0, scaleY: 0 }}
						transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
						style={{ transformOrigin: 'top' }}
					>
						<div className={styles.BlogSearch__search_wrapper}>
							<input
								type="text"
								placeholder="Search articles..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={styles.BlogSearch__search_input}
								autoFocus
							/>
							{searchTerm && (
								<motion.button
									className={styles.BlogSearch__clear_button}
									onClick={() => setSearchTerm('')}
									initial={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0 }}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
										<path
											d="M18 6L6 18M6 6L18 18"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</motion.button>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{(searchTerm || selectedCategory !== 'All') && (
					<motion.div
						className={styles.BlogSearch__results}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						transition={{ duration: 0.3 }}
					>
						<span className={styles.BlogSearch__results_text}>
							{filteredPosts.length} article
							{filteredPosts.length !== 1 ? 's' : ''} found
						</span>
						<motion.button
							className={styles.BlogSearch__clear_all}
							onClick={clearFilters}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Clear filters
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default BlogSearch;
