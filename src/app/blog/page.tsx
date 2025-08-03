'use client';

import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'motion/react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';

import { BlogNavbar } from 'components/layouts';
import { BlogCard } from 'components/pages';
import {
	MaskText,
	BlogBackground,
	BlogSearch,
	BlogNoResults,
	Subscribe,
} from 'components/utilities';
import { convertContentfulBlogPost } from 'helpers/contentful';
import { GET_ALL_BLOG_POSTS } from 'queries';
import type { BlogPost } from 'types/blog';

import styles from './Blog.module.scss';
import { useApollo } from '../../../lib/apolloClient';

/**
 * Blog listing page component with modern animations and design
 */
const BlogPage: FC = () => {
	const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
	const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

	// Initialize Apollo client
	const client = useApollo({});

	// Fetch blog posts from Contentful
	const { data, loading, error } = useQuery(GET_ALL_BLOG_POSTS, {
		client,
		variables: { limit: 50, skip: 0 },
	});

	useEffect(() => {
		if (data?.blogPostCollection?.items) {
			const posts = data.blogPostCollection.items.map(
				convertContentfulBlogPost
			);
			setAllPosts(posts);
			setFilteredPosts(posts);
		}
	}, [data]);

	if (loading) {
		return (
			<div className={styles.blog}>
				<BlogNavbar />
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
					<div className={styles.blog__loading}>
						<div className={styles.blog__loading_spinner} />
						<p>Loading articles...</p>
					</div>
				</motion.div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.blog}>
				<BlogNavbar />
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
			<BlogNavbar />
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
						transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
					>
						<h1 className={styles.blog__title}>
							<MaskText phrases={['Thoughts & Insights']} />
						</h1>
						<p className={styles.blog__subtitle}>
							Exploring design, development, and the intersection of creativity
							and technology
						</p>
					</motion.div>
				</section>
				<section className={styles.blog__search}>
					<BlogSearch posts={allPosts} onFilterChange={setFilteredPosts} />
				</section>
				<section className={styles.blog__content}>
					<AnimatePresence mode="wait">
						{filteredPosts.length > 0 ? (
							<motion.div
								className={styles.blog__grid}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{
									duration: 0.8,
									delay: 0.4,
									ease: [0.33, 1, 0.68, 1],
								}}
							>
								{filteredPosts.map((post, index) => (
									<motion.div
										key={post.id}
										initial={{ opacity: 0, y: 30 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.6,
											delay: 0.6 + index * 0.1,
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
				</section>
				<Subscribe delay={1.2} />
			</motion.div>
		</div>
	);
};

export default BlogPage;
