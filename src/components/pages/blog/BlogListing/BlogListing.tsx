'use client';
import { motion, AnimatePresence } from 'motion/react';
import type { FC } from 'react';
import { useState } from 'react';

import { Navbar } from 'components/layouts';
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
}

/**
 * Blog listing page component with modern animations and design
 */
const BlogListing: FC<BlogListingProps> = ({ posts }) => {
	const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

	if (posts.length === 0) {
		return (
			<div className={styles.blog}>
				<Navbar />
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
			<Navbar />
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
						<div className={styles.blog__cta}>
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
				<section className={styles.blog__search}>
					<BlogSearch posts={posts} onFilterChange={setFilteredPosts} />
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

export default BlogListing;
