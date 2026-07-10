'use client';
import { motion, AnimatePresence } from 'motion/react';
import type { FC } from 'react';
import { useState } from 'react';

import { SearchIcon } from 'assets/icons';

import styles from './BlogSearch.module.scss';

interface BlogSearchProps {
	allCategories: string[];
	allTags: string[];
	activeCategory: string;
	activeTags: string[];
	searchTerm: string;
	filteredCount: number;
	isFiltering: boolean;
	onCategoryChange: (category: string) => void;
	onTagToggle: (tag: string) => void;
	onSearchChange: (value: string) => void;
	onClearAll: () => void;
}

const BlogSearch: FC<BlogSearchProps> = ({
	allCategories,
	allTags,
	activeCategory,
	activeTags,
	searchTerm,
	filteredCount,
	isFiltering,
	onCategoryChange,
	onTagToggle,
	onSearchChange,
	onClearAll,
}) => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const hasActiveFilter =
		searchTerm.trim() || activeCategory !== 'All' || activeTags.length > 0;

	return (
		<motion.div
			className={styles.BlogSearch}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
		>
			{/* Category row */}
			<div className={styles.BlogSearch__container}>
				<div className={styles.BlogSearch__categories}>
					{allCategories.map((category, index) => (
						<motion.button
							key={category}
							className={`${styles.BlogSearch__category} ${
								activeCategory === category
									? styles.BlogSearch__category_active
									: ''
							}`}
							onClick={() => onCategoryChange(category)}
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

			{/* Tag pills */}
			{allTags.length > 0 && (
				<motion.div
					className={styles.BlogSearch__tags_section}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.5 }}
				>
					<span className={styles.BlogSearch__tags_label}>Filter by topic</span>
					<div className={styles.BlogSearch__tags}>
						{allTags.map((tag, index) => {
							const isActive = activeTags.includes(tag);
							return (
								<motion.button
									key={tag}
									className={`${styles.BlogSearch__tag} ${
										isActive ? styles.BlogSearch__tag_active : ''
									}`}
									onClick={() => onTagToggle(tag)}
									initial={{ opacity: 0, scale: 0.85 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										duration: 0.25,
										delay: 0.5 + index * 0.03,
										ease: [0.33, 1, 0.68, 1],
									}}
									whileHover={{ scale: 1.06 }}
									whileTap={{ scale: 0.94 }}
								>
									{tag}
								</motion.button>
							);
						})}
					</div>
				</motion.div>
			)}

			{/* Search input */}
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
								onChange={(e) => onSearchChange(e.target.value)}
								className={styles.BlogSearch__search_input}
								autoFocus
							/>
							{searchTerm && (
								<motion.button
									className={styles.BlogSearch__clear_button}
									onClick={() => onSearchChange('')}
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

			{/* Results bar */}
			<AnimatePresence>
				{hasActiveFilter && (
					<motion.div
						className={styles.BlogSearch__results}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						transition={{ duration: 0.3 }}
					>
						<span className={styles.BlogSearch__results_text}>
							{isFiltering ? (
								<span className={styles.BlogSearch__results_loading}>
									Filtering…
								</span>
							) : (
								<>
									{filteredCount} article{filteredCount !== 1 ? 's' : ''} found
								</>
							)}
						</span>
						<motion.button
							className={styles.BlogSearch__clear_all}
							onClick={onClearAll}
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
