'use client';
import { motion, AnimatePresence } from 'motion/react';
import type { FC } from 'react';
import { useState } from 'react';

import { BlogNavbar } from 'components/layouts';
import { BlogCard } from 'components/pages';
import {
	MaskText,
	BlogBackground,
	BlogSearch,
	BlogNoResults,
} from 'components/utilities';
import { blogData } from 'constants/blogData';
import type { BlogPost } from 'types/blog';

import styles from './Blog.module.scss';

/**
 * Blog listing page component with modern animations and design
 */
const BlogPage: FC = () => {
	const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogData);

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
					<BlogSearch posts={blogData} onFilterChange={setFilteredPosts} />
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
				<motion.section
					className={styles.blog__newsletter}
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.2, ease: [0.33, 1, 0.68, 1] }}
				>
					<div className={styles.blog__newsletter_content}>
						<h2 className={styles.blog__newsletter_title}>STAY UPDATED</h2>
						<p className={styles.blog__newsletter_text}>
							Get notified when I publish new articles about design,
							development, and creative insights.
						</p>
						<div className={styles.blog__newsletter_form}>
							<input
								type="email"
								placeholder="Enter your email"
								className={styles.blog__newsletter_input}
							/>
							<button className={styles.blog__newsletter_button}>
								Subscribe
							</button>
						</div>
					</div>
				</motion.section>
			</motion.div>
		</div>
	);
};

export default BlogPage;
