'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import type { FC } from 'react';

import type { BlogPost } from 'types/blog';

import styles from './BlogCard.module.scss';

interface BlogCardProps {
	post: BlogPost;
}

/**
 * BlogCard component displays a single blog post with hover animations
 * and modern design following the project's patterns
 */
const BlogCard: FC<BlogCardProps> = ({ post }) => {
	return (
		<motion.div
			className={styles.BlogCard}
			whileHover={{ y: -8 }}
			transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
		>
			<Link href={`/blog/${post.slug}`} className={styles.BlogCard__link}>
				<div className={styles.BlogCard__image_container}>
					{post.featuredImage && (
						<div className={styles.BlogCard__image_wrapper}>
							<img
								src={post.featuredImage.url}
								alt={post.featuredImage.title || post.title}
								className={styles.BlogCard__image}
								loading="lazy"
							/>
							<div className={styles.BlogCard__image_overlay} />
						</div>
					)}
					<div className={styles.BlogCard__category}>{post.category}</div>
				</div>
				<div className={styles.BlogCard__content}>
					<div className={styles.BlogCard__meta}>
						<span className={styles.BlogCard__date}>
							{new Date(post.publishedAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</span>
						<span className={styles.BlogCard__read_time}>
							{post.readTime} min read
						</span>
					</div>
					<h3 className={styles.BlogCard__title}>{post.title}</h3>
					<p className={styles.BlogCard__excerpt}>{post.excerpt}</p>
					<div className={styles.BlogCard__footer}>
						<div className={styles.BlogCard__tags}>
							{post.tags.slice(0, 3).map((tag, tagIndex) => (
								<span key={tagIndex} className={styles.BlogCard__tag}>
									{tag}
								</span>
							))}
						</div>
						<div className={styles.BlogCard__arrow}>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M7 17L17 7M17 7H7M17 7V17"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
					</div>
				</div>
				<div className={styles.BlogCard__hover_line} />
			</Link>
		</motion.div>
	);
};

export default BlogCard;
