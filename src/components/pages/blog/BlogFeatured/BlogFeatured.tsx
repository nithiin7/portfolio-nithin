import Link from 'next/link';
import type { FC, ReactElement } from 'react';

import ThemedImage from 'components/utilities/ThemedImage/ThemedImage';
import { formatPostDate } from 'helpers/blogPosts';
import type { BlogPost } from 'types/blog';

import styles from './BlogFeatured.module.scss';

interface BlogFeaturedProps {
	post: BlogPost;
}

/**
 * The latest article, given a full-width editorial slot above the index.
 * The cover is never clip-revealed: a clipped element at snapshot time would
 * blank the morph back from the post page.
 */
const BlogFeatured: FC<BlogFeaturedProps> = ({ post }): ReactElement => (
	<article className={styles.BlogFeatured} aria-labelledby="featured-title">
		{post.featuredImage?.url && (
			<div className={styles.BlogFeatured__media} aria-hidden="true">
				<div className={styles.BlogFeatured__image}>
					<ThemedImage
						src={post.featuredImage.url}
						srcDark={post.featuredImageDark?.url}
						alt=""
						fill
						priority
						fetchPriority="high"
						sizes="(min-width: 1024px) 58vw, 100vw"
					/>
				</div>
			</div>
		)}

		<div className={styles.BlogFeatured__text}>
			<p className={styles.BlogFeatured__kicker}>
				<span className={styles.BlogFeatured__dot} aria-hidden="true" />
				Latest
				<span aria-hidden="true"> · </span>
				<time dateTime={post.publishedAt}>
					{formatPostDate(post.publishedAt, 'long')}
				</time>
			</p>

			<h2 id="featured-title" className={styles.BlogFeatured__title}>
				<Link href={`/blog/${post.slug}`} className={styles.BlogFeatured__link}>
					<span className={styles.BlogFeatured__titleText}>{post.title}</span>
				</Link>
			</h2>

			{post.excerpt && (
				<p className={styles.BlogFeatured__excerpt}>{post.excerpt}</p>
			)}

			<p className={styles.BlogFeatured__meta}>
				{post.category && (
					<span className={styles.BlogFeatured__tag}>{post.category}</span>
				)}
				{post.readTime > 0 && <span>{post.readTime} min read</span>}
				<span className={styles.BlogFeatured__cta} aria-hidden="true">
					Read article →
				</span>
			</p>
		</div>
	</article>
);

export default BlogFeatured;
