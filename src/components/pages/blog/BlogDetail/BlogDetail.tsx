import {
	documentToReactComponents,
	type Options,
} from '@contentful/rich-text-react-renderer';
import {
	BLOCKS,
	INLINES,
	MARKS,
	type Block,
	type Inline,
} from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';
import {
	ViewTransition,
	type FC,
	type ReactElement,
	type ReactNode,
} from 'react';

import RevealText from 'components/motion/RevealText/RevealText';
import BlogRow from 'components/pages/blog/BlogRow/BlogRow';
import CodeBlock from 'components/pages/blog/CodeBlock/CodeBlock';
import CommentSection from 'components/pages/blog/CommentSection/CommentSection';
import PostProgress from 'components/pages/blog/PostProgress/PostProgress';
import PostShare from 'components/pages/blog/PostShare/PostShare';
import TableOfContents from 'components/pages/blog/TableOfContents/TableOfContents';
import Subscribe from 'components/utilities/Subscribe/Subscribe';
import { absoluteUrl, siteConfig } from 'config/site';
import { formatPostDate } from 'helpers/blogPosts';
import {
	codeBlockSource,
	createSlugger,
	extractHeadings,
	plainText,
} from 'helpers/richText';
import { shareLinks } from 'helpers/social';
import type { BlogAsset, BlogPost } from 'types/blog';

import styles from './BlogDetail.module.scss';

interface BlogDetailProps {
	post: BlogPost;
	relatedPosts: BlogPost[];
}

const isInternal = (uri: string): boolean =>
	uri.startsWith('/') || uri.startsWith('#') || uri.startsWith(siteConfig.url);

const richTextOptions = (assets: Map<string, BlogAsset>): Options => {
	// Must walk headings in the same order as extractHeadings so ids match the TOC
	const slug = createSlugger();
	const heading =
		(Tag: 'h2' | 'h3' | 'h4') =>
		(node: Block | Inline, children: ReactNode) => {
			const text = plainText(node).trim();
			if (!text) return null;
			if (Tag === 'h4') return <h4>{children}</h4>;
			return (
				<Tag id={slug(text)} tabIndex={-1}>
					{children}
				</Tag>
			);
		};

	return {
		renderMark: {
			[MARKS.CODE]: (text) => <code>{text}</code>,
		},
		renderNode: {
			[BLOCKS.HEADING_1]: heading('h2'),
			[BLOCKS.HEADING_2]: heading('h2'),
			[BLOCKS.HEADING_3]: heading('h3'),
			[BLOCKS.HEADING_4]: heading('h4'),
			[BLOCKS.HEADING_5]: heading('h4'),
			[BLOCKS.HEADING_6]: heading('h4'),
			[BLOCKS.PARAGRAPH]: (node, children) => {
				const code = codeBlockSource(node as Block);
				if (code) return <CodeBlock code={code} />;
				const empty = (node as Block).content.every(
					(child) => child.nodeType === 'text' && !child.value.trim()
				);
				return empty ? null : <p>{children}</p>;
			},
			[BLOCKS.HR]: () => <hr />,
			[INLINES.HYPERLINK]: (node, children) => {
				const uri: string = node.data.uri;
				return isInternal(uri) ? (
					<a href={uri}>{children}</a>
				) : (
					<a href={uri} target="_blank" rel="noopener noreferrer">
						{children}
						<span className={styles.Post__sr}> (opens in a new tab)</span>
					</a>
				);
			},
			[BLOCKS.EMBEDDED_ASSET]: (node) => {
				const asset = assets.get(node.data?.target?.sys?.id);
				if (!asset?.url) return null;
				return (
					<figure className={styles.Post__figure}>
						<Image
							src={asset.url}
							alt={asset.description || asset.title || ''}
							width={1600}
							height={1000}
							sizes="(min-width: 1920px) 39vw, (min-width: 1024px) 46rem, 100vw"
						/>
						{asset.title && <figcaption>{asset.title}</figcaption>}
					</figure>
				);
			},
		},
	};
};

const BlogDetail: FC<BlogDetailProps> = ({
	post,
	relatedPosts,
}): ReactElement => {
	const doc = post.content?.json;
	const hasBody = Boolean(doc?.content?.length);
	const toc = extractHeadings(doc);
	const assets = new Map(
		(post.content?.links?.assets?.block ?? []).map((asset) => [
			asset.sys.id,
			asset,
		])
	);
	const url = absoluteUrl(`/blog/${post.slug}`);
	const updated =
		post.updatedAt &&
		post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10)
			? post.updatedAt
			: null;

	return (
		<article className={styles.Post}>
			<header className={styles.Post__hero}>
				<div className={styles.Post__topline}>
					<Link href="/blog" className={styles.Post__back}>
						<span aria-hidden="true">←</span> All writing
					</Link>
					{post.category && (
						<p className={styles.Post__kicker}>{post.category}</p>
					)}
				</div>

				<RevealText as="h1" trigger="mount" className={styles.Post__title}>
					{post.title}
				</RevealText>

				{post.excerpt && (
					<RevealText
						as="p"
						trigger="mount"
						delay={0.2}
						className={styles.Post__lede}
					>
						{post.excerpt}
					</RevealText>
				)}

				<dl className={styles.Post__meta}>
					{post.authorName && (
						<div>
							<dt>Written by</dt>
							<dd>{post.authorName}</dd>
						</div>
					)}
					<div>
						<dt>Published</dt>
						<dd>
							<time dateTime={post.publishedAt}>
								{formatPostDate(post.publishedAt, 'long')}
							</time>
						</dd>
					</div>
					{updated && (
						<div>
							<dt>Updated</dt>
							<dd>
								<time dateTime={updated}>
									{formatPostDate(updated, 'long')}
								</time>
							</dd>
						</div>
					)}
					{post.readTime > 0 && (
						<div>
							<dt>Reading time</dt>
							<dd>{post.readTime} min</dd>
						</div>
					)}
				</dl>
			</header>

			{post.featuredImage?.url && (
				// Not clip-revealed: a clipped cover at capture would blank the morph from the index
				<ViewTransition
					name={`blog-image-${post.slug}`}
					share="blog-image-morph"
					enter="none"
					exit="none"
					update="none"
				>
					<div className={styles.Post__cover}>
						<Image
							src={post.featuredImage.url}
							alt={post.featuredImage.description || ''}
							fill
							priority
							sizes="100vw"
						/>
					</div>
				</ViewTransition>
			)}

			<PostProgress slug={post.slug}>
				<div className={styles.Post__layout}>
					{toc.length > 1 && (
						<aside className={styles.Post__rail}>
							<TableOfContents items={toc} variant="rail" />
						</aside>
					)}

					<div className={styles.Post__main}>
						{toc.length > 1 && (
							<TableOfContents
								items={toc}
								variant="inline"
								className={styles.Post__tocInline}
							/>
						)}

						{hasBody ? (
							<div className={styles.Post__prose}>
								{documentToReactComponents(doc, richTextOptions(assets))}
							</div>
						) : (
							<p className={styles.Post__empty}>
								This article has no content yet.
							</p>
						)}

						<span className={styles.Post__end} aria-hidden="true" />

						<footer className={styles.Post__footer}>
							{post.tags.length > 0 && (
								<div className={styles.Post__footerRow}>
									<p className={styles.Post__footerLabel}>Filed under</p>
									<ul className={styles.Post__tags}>
										{post.tags.map((tag) => (
											<li key={tag}>
												<Link
													href={`/blog?tag=${encodeURIComponent(tag)}`}
													className={styles.Post__tag}
												>
													#{tag}
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}
							<div className={styles.Post__footerRow}>
								<p className={styles.Post__footerLabel}>Share</p>
								<PostShare
									url={url}
									links={shareLinks({ url, title: post.title })}
								/>
							</div>
						</footer>
					</div>
				</div>
			</PostProgress>

			<div className={styles.Post__after}>
				{relatedPosts.length > 0 && (
					<section
						className={styles.Post__related}
						aria-labelledby="related-title"
					>
						<div className={styles.Post__relatedHead}>
							<h2 id="related-title" className={styles.Post__relatedTitle}>
								Keep reading
							</h2>
							<Link href="/blog" className={styles.Post__back}>
								All writing <span aria-hidden="true">→</span>
							</Link>
						</div>
						<ol className={styles.Post__relatedList}>
							{relatedPosts.map((related) => (
								<li key={related.id}>
									<BlogRow post={related} />
								</li>
							))}
						</ol>
					</section>
				)}

				<CommentSection postId={post.id} />

				<Subscribe />
			</div>
		</article>
	);
};

export default BlogDetail;
