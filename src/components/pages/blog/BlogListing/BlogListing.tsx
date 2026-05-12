'use client';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import type { FC } from 'react';
import { useState, useMemo, useEffect, useTransition } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

import { fetchFilteredPosts } from 'app/blog/actions';
import {
	BlogBackground,
	BlogCard,
	BlogNoResults,
	BlogSearch,
} from 'components/pages';
import { MaskText, Subscribe, ColorMaskButton } from 'components/utilities';
import type { BlogPost } from 'types/blog';

import styles from './BlogListing.module.scss';

interface BlogListingProps {
	posts: BlogPost[];
	total: number;
	allCategories: string[];
	allTags: string[];
	initialCategory: string;
	initialTags: string[];
}

const BlogListing: FC<BlogListingProps> = ({
	posts,
	total,
	allCategories,
	allTags,
	initialCategory,
	initialTags,
}) => {
	const [allPosts, setAllPosts] = useState<BlogPost[]>(posts);
	const [displayTotal, setDisplayTotal] = useState(total);
	const [activeCategory, setActiveCategory] = useState(initialCategory);
	const [activeTags, setActiveTags] = useState<string[]>(initialTags);
	const [searchTerm, setSearchTerm] = useState('');
	const [loadMoreHovered, setLoadMoreHovered] = useState(false);
	const [filterError, setFilterError] = useState(false);
	const [isFiltering, startFilterTransition] = useTransition();
	const [isLoadingMore, startLoadMoreTransition] = useTransition();

	const hasMore = allPosts.length < displayTotal;

	const filteredPosts = useMemo(() => {
		if (!searchTerm) return allPosts;
		const lower = searchTerm.toLowerCase();
		return allPosts.filter(
			(post) =>
				post.title.toLowerCase().includes(lower) ||
				post.excerpt.toLowerCase().includes(lower) ||
				post.category.toLowerCase().includes(lower)
		);
	}, [allPosts, searchTerm]);

	useEffect(() => {
		const params = new URLSearchParams();
		if (activeCategory !== 'All') params.set('category', activeCategory);
		activeTags.forEach((t) => params.append('tag', t));
		const qs = params.toString();
		window.history.replaceState(
			{},
			'',
			`${window.location.pathname}${qs ? `?${qs}` : ''}`
		);
	}, [activeCategory, activeTags]);

	const handleCategoryChange = (category: string) => {
		setActiveCategory(category);
		setActiveTags([]);
		setFilterError(false);
		startFilterTransition(async () => {
			try {
				const result = await fetchFilteredPosts(
					0,
					category !== 'All' ? category : undefined,
					[]
				);
				setAllPosts(result.posts);
				setDisplayTotal(result.total);
			} catch {
				setFilterError(true);
				setActiveCategory(initialCategory);
			}
		});
	};

	const handleTagToggle = (tag: string) => {
		const next = activeTags.includes(tag)
			? activeTags.filter((t) => t !== tag)
			: [...activeTags, tag];
		setActiveTags(next);
		setActiveCategory('All');
		setFilterError(false);
		startFilterTransition(async () => {
			try {
				const result = await fetchFilteredPosts(0, undefined, next);
				setAllPosts(result.posts);
				setDisplayTotal(result.total);
			} catch {
				setFilterError(true);
				setActiveTags([]);
			}
		});
	};

	const handleClearAll = () => {
		setActiveCategory('All');
		setActiveTags([]);
		setSearchTerm('');
		setFilterError(false);
		startFilterTransition(async () => {
			try {
				const result = await fetchFilteredPosts(0);
				setAllPosts(result.posts);
				setDisplayTotal(result.total);
			} catch {
				setFilterError(true);
			}
		});
	};

	const handleLoadMore = () => {
		startLoadMoreTransition(async () => {
			try {
				const result = await fetchFilteredPosts(
					allPosts.length,
					activeCategory !== 'All' ? activeCategory : undefined,
					activeTags
				);
				setAllPosts((prev) => [...prev, ...result.posts]);
			} catch {
				setFilterError(true);
			}
		});
	};

	if (posts.length === 0) {
		return (
			<div className={styles.blog}>
				<BlogBackground />
				<motion.div
					className={styles.blog__container}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
				>
					<section className={styles.blog__header}>
						<motion.div
							className={styles.blog__header_content}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.8,
								delay: 0.2,
								ease: [0.33, 1, 0.68, 1],
							}}
						>
							<h1 className={styles.blog__title}>
								<MaskText phrases={['Thoughts & Insights']} />
							</h1>
							<p className={styles.blog__subtitle}>
								Exploring design, development, and the intersection of
								creativity and technology
							</p>
						</motion.div>
					</section>
					<div className={styles.blog__error}>
						<p>Error loading articles. Please try again later.</p>
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className={styles.blog}>
			<BlogBackground />
			<motion.div
				className={styles.blog__container}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
			>
				<Link href="/" className={styles.blog__backButton}>
					<FiArrowLeft size={16} />
					<span>Back to Home</span>
				</Link>
				<section className={styles.blog__header}>
					<motion.div
						className={styles.blog__header_content}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
					>
						<h1 className={styles.blog__title}>
							<MaskText phrases={['Thoughts & Insights']} />
						</h1>
						<p className={styles.blog__subtitle}>
							Exploring design, development, and the intersection of creativity
							and technology
						</p>
						<div className={styles.blog__cta}>
							<ColorMaskButton
								text="Read on Medium"
								href="https://medium.com/@nithiin7"
								variant="default"
								target="_blank"
								rel="noopener noreferrer"
							/>
							<ColorMaskButton
								text="Read more on DEV.to"
								href="https://dev.to/nithiin7"
								variant="default"
								target="_blank"
								rel="noopener noreferrer"
							/>
						</div>
					</motion.div>
				</section>
				{filterError && (
					<motion.p
						className={styles.blog__filter_error}
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						Failed to load filtered results. Please try again.
					</motion.p>
				)}
				<section className={styles.blog__search}>
					<BlogSearch
						allCategories={allCategories}
						allTags={allTags}
						activeCategory={activeCategory}
						activeTags={activeTags}
						searchTerm={searchTerm}
						filteredCount={filteredPosts.length}
						isFiltering={isFiltering}
						onCategoryChange={handleCategoryChange}
						onTagToggle={handleTagToggle}
						onSearchChange={setSearchTerm}
						onClearAll={handleClearAll}
					/>
				</section>
				<section className={styles.blog__content}>
					<AnimatePresence mode="wait">
						{filteredPosts.length > 0 ? (
							<motion.div
								className={styles.blog__grid}
								animate={{ opacity: isFiltering ? 0.4 : 1 }}
								initial={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								{filteredPosts.map((post, index) => (
									<motion.div
										key={post.id}
										initial={{ opacity: 0, y: 30 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.6,
											delay: 0.4 + index * 0.08,
											ease: [0.33, 1, 0.68, 1],
										}}
									>
										<BlogCard post={post} />
									</motion.div>
								))}
							</motion.div>
						) : (
							<BlogNoResults />
						)}
					</AnimatePresence>
					{hasMore && (
						<motion.div
							className={styles.blog__load_more}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4 }}
						>
							<motion.button
								className={styles.blog__load_more_btn}
								onClick={handleLoadMore}
								disabled={isLoadingMore || isFiltering}
								onMouseEnter={() => setLoadMoreHovered(true)}
								onMouseLeave={() => setLoadMoreHovered(false)}
								whileHover={{ scale: isLoadingMore ? 1 : 1.02 }}
								whileTap={{ scale: isLoadingMore ? 1 : 0.98 }}
								transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
							>
								<div className={styles.blog__load_more_content}>
									<motion.span
										className={styles.blog__load_more_text}
										animate={{
											y: loadMoreHovered ? -30 : 0,
											opacity: loadMoreHovered ? 0 : 1,
										}}
										transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
									>
										{isLoadingMore ? 'Loading...' : 'Load more'}
									</motion.span>
									<motion.span
										className={`${styles.blog__load_more_text} ${styles.blog__load_more_text_dup}`}
										animate={{
											y: loadMoreHovered ? 0 : 30,
											opacity: loadMoreHovered ? 1 : 0,
										}}
										transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
									>
										{isLoadingMore ? 'Loading...' : 'Load more'}
									</motion.span>
								</div>
								<motion.div
									className={styles.blog__load_more_bg}
									animate={{
										scale: loadMoreHovered ? 1 : 0,
										opacity: loadMoreHovered ? 1 : 0,
									}}
									transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
								/>
							</motion.button>
						</motion.div>
					)}
				</section>
				<Subscribe delay={1.2} />
			</motion.div>
		</div>
	);
};

export default BlogListing;
