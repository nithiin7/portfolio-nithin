import Link from 'next/link';
import type { FC, ReactElement } from 'react';

import CopyText from 'components/utilities/CopyText/CopyText';
import { formatDate } from 'helpers/format';
import type { BlogPost } from 'types/blog';

import styles from './RssFeed.module.scss';

interface RssFeedProps {
	feedUrl: string;
	posts: Pick<BlogPost, 'id' | 'slug' | 'title' | 'publishedDate'>[];
}

const RssFeed: FC<RssFeedProps> = ({ feedUrl, posts }): ReactElement => (
	<div className={styles.RssFeed}>
		<header className={styles.RssFeed__hero}>
			<p className={styles.RssFeed__kicker}>RSS</p>
			<h1 className={styles.RssFeed__title}>Subscribe</h1>
			<p className={styles.RssFeed__lede}>
				Paste this address into a feed reader such as Feedly, Inoreader or
				NetNewsWire to get new posts as they’re published.
			</p>
			<CopyText
				text={feedUrl}
				label="Feed URL"
				className={styles.RssFeed__url}
			/>
			<ul className={styles.RssFeed__links}>
				<li>
					<a href={feedUrl} className={styles.RssFeed__mono}>
						Raw feed
					</a>
				</li>
				<li>
					<Link href="/blog" className={styles.RssFeed__mono}>
						All writing
					</Link>
				</li>
			</ul>
		</header>

		{posts.length > 0 && (
			<section className={styles.RssFeed__latest} aria-labelledby="rss-latest">
				<h2 id="rss-latest" className={styles.RssFeed__kicker}>
					Latest in the feed
				</h2>
				<ol className={styles.RssFeed__list}>
					{posts.map((post) => (
						<li key={post.id} className={styles.RssFeed__item}>
							<Link
								href={`/blog/${post.slug}`}
								className={styles.RssFeed__post}
							>
								<span className={styles.RssFeed__postTitle}>{post.title}</span>
								<time
									dateTime={post.publishedDate}
									className={styles.RssFeed__date}
								>
									{formatDate(post.publishedDate, 'short')}
								</time>
							</Link>
						</li>
					))}
				</ol>
			</section>
		)}
	</div>
);

export default RssFeed;
