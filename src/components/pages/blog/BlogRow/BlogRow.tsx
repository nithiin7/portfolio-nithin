import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition, type FC, type ReactElement } from 'react';

import { formatPostDate } from 'helpers/blogPosts';
import type { BlogPost } from 'types/blog';

import styles from './BlogRow.module.scss';

interface BlogRowProps {
	post: BlogPost;
	/** Heading level for the title, so the row fits the surrounding outline. */
	headingLevel?: 'h3' | 'h4';
}

/**
 * One line of the article index: date, title, category, reading time and a
 * small cover. The cover carries the `blog-image-{slug}` name so it morphs
 * into the post hero.
 */
const BlogRow: FC<BlogRowProps> = ({
	post,
	headingLevel: Heading = 'h3',
}): ReactElement => (
	<article className={styles.BlogRow}>
		<div className={styles.BlogRow__grid}>
			<time className={styles.BlogRow__date} dateTime={post.publishedAt}>
				{formatPostDate(post.publishedAt)}
			</time>

			<div className={styles.BlogRow__body}>
				<Heading className={styles.BlogRow__title}>
					<Link href={`/blog/${post.slug}`} className={styles.BlogRow__link}>
						<span className={styles.BlogRow__titleText}>{post.title}</span>
					</Link>
				</Heading>
				{post.excerpt && (
					<p className={styles.BlogRow__excerpt}>{post.excerpt}</p>
				)}
			</div>

			<p className={styles.BlogRow__meta}>
				{post.category && (
					<span className={styles.BlogRow__tag}>{post.category}</span>
				)}
				{post.readTime > 0 && (
					<span className={styles.BlogRow__time}>{post.readTime} min read</span>
				)}
			</p>

			<div className={styles.BlogRow__thumb} aria-hidden="true">
				{post.featuredImage?.url && (
					<ViewTransition
						name={`blog-image-${post.slug}`}
						share="blog-image-morph"
						enter="none"
						exit="none"
						update="none"
					>
						<div className={styles.BlogRow__thumbInner}>
							<Image
								src={post.featuredImage.url}
								alt=""
								fill
								sizes="(min-width: 1920px) 10vw, (min-width: 768px) 12rem, 6rem"
							/>
						</div>
					</ViewTransition>
				)}
			</div>
		</div>
	</article>
);

export default BlogRow;
