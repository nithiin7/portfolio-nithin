'use client';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

import { BlogNavbar } from 'components/layouts';
import { BlogCard } from 'components/pages';
import { MaskText, TableOfContents, Subscribe } from 'components/utilities';
import { formatDate } from 'helpers/blog';
import type { BlogPost } from 'types/blog';

import styles from './BlogDetail.module.scss';

interface BlogDetailProps {
	post: BlogPost;
	relatedPosts: BlogPost[];
}

/**
 * Blog detail client component with data fetching and modern animations
 */
const BlogDetail: FC<BlogDetailProps> = ({ post, relatedPosts }) => {
	const shareOnFacebook = () => {
		if (!post) return;
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(post.title);
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
			'_blank'
		);
	};

	const shareOnTwitter = () => {
		if (!post) return;
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(post.title);
		window.open(
			`https://twitter.com/intent/tweet?url=${url}&text=${text}`,
			'_blank'
		);
	};

	const shareOnLinkedIn = () => {
		if (!post) return;
		const url = encodeURIComponent(window.location.href);
		const title = encodeURIComponent(post.title);
		const summary = encodeURIComponent(post.excerpt);
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`,
			'_blank'
		);
	};

	const shareOnWhatsApp = () => {
		if (!post) return;
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(`${post.title} - ${post.excerpt}`);
		window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
	};

	if (!post) {
		return (
			<div className={styles.blogDetail}>
				<BlogNavbar />
				<motion.div
					className={styles.blogDetail__container}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
				>
					<motion.nav
						className={styles.blogDetail__breadcrumb}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<Link href="/blog" className={styles.blogDetail__breadcrumb_link}>
							← &nbsp;Back to Blog
						</Link>
					</motion.nav>
					<div className={styles.blogDetail__error}>
						<h1>Article Not Found</h1>
						<p>
							The article you're looking for doesn't exist or has been removed.
						</p>
						<Link href="/blog" className={styles.blogDetail__error_link}>
							Back to Blog
						</Link>
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className={styles.blogDetail}>
			<BlogNavbar />
			<motion.div
				className={styles.blogDetail__container}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
			>
				<motion.nav
					className={styles.blogDetail__breadcrumb}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Link href="/blog" className={styles.blogDetail__breadcrumb_link}>
						← &nbsp;Back to Blog
					</Link>
				</motion.nav>
				<motion.section
					className={styles.blogDetail__hero}
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				>
					{post.featuredImage && (
						<div className={styles.blogDetail__hero_background}>
							<Image
								src={post.featuredImage.url}
								alt={post.featuredImage.title || post.title}
								fill
								className={styles.blogDetail__hero_bg_image}
								priority
							/>
							<div className={styles.blogDetail__hero_overlay} />
						</div>
					)}
					<div className={styles.blogDetail__hero_content}>
						<motion.div
							className={styles.blogDetail__category}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							{post.category}
						</motion.div>
						<motion.h1
							className={styles.blogDetail__title}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.5 }}
						>
							<MaskText phrases={[post.title]} />
						</motion.h1>
						<motion.p
							className={styles.blogDetail__excerpt}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
						>
							{post.excerpt}
						</motion.p>
						<motion.div
							className={styles.blogDetail__meta}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.7 }}
						>
							<div className={styles.blogDetail__meta_author}>
								{post.authorAvatar && (
									<Image
										src={post.authorAvatar.url}
										alt={post.authorAvatar.title || post.authorName}
										width={32}
										height={32}
										className={styles.blogDetail__meta_avatar}
									/>
								)}
								<span className={styles.blogDetail__meta_name}>
									{post.authorName}
								</span>
							</div>
							<div className={styles.blogDetail__meta_info}>
								<span className={styles.blogDetail__meta_readtime}>
									{post.readTime} Mins. Read
								</span>
								<span className={styles.blogDetail__meta_date}>
									{formatDate(post.publishedAt, 'long')}
								</span>
							</div>
						</motion.div>
						<motion.div
							className={styles.blogDetail__social}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.8 }}
						>
							<h4 className={styles.blogDetail__social_title}>SHARE</h4>
							<div className={styles.blogDetail__social_buttons}>
								<button
									onClick={shareOnFacebook}
									className={`${styles.blogDetail__social_button} ${styles.blogDetail__social_button_facebook}`}
									aria-label="Share on Facebook"
								>
									f
								</button>
								<button
									onClick={shareOnTwitter}
									className={`${styles.blogDetail__social_button} ${styles.blogDetail__social_button_twitter}`}
									aria-label="Share on Twitter"
								>
									𝕏
								</button>
								<button
									onClick={shareOnLinkedIn}
									className={`${styles.blogDetail__social_button} ${styles.blogDetail__social_button_linkedin}`}
									aria-label="Share on LinkedIn"
								>
									in
								</button>
								<button
									onClick={shareOnWhatsApp}
									className={`${styles.blogDetail__social_button} ${styles.blogDetail__social_button_whatsapp}`}
									aria-label="Share on WhatsApp"
								>
									📱
								</button>
							</div>
						</motion.div>
					</div>
				</motion.section>
				{post.tags.length > 0 && (
					<motion.section
						className={styles.blogDetail__tags}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.9 }}
					>
						{post.tags.map((tag, index) => (
							<motion.span
								key={tag}
								className={styles.blogDetail__tag}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
								whileHover={{ scale: 1.05 }}
							>
								{tag}
							</motion.span>
						))}
					</motion.section>
				)}
				<div className={styles.blogDetail__content_wrapper}>
					<motion.article
						className={styles.blogDetail__content}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 1.1 }}
					>
						{post.content?.json ? (
							documentToReactComponents(post.content.json, {
								renderNode: {
									'heading-1': (node, children) => (
										<h1 className={styles.blogDetail__content_h1}>
											{children}
										</h1>
									),
									'heading-2': (node, children) => (
										<h2 className={styles.blogDetail__content_h2}>
											{children}
										</h2>
									),
									'heading-3': (node, children) => (
										<h3 className={styles.blogDetail__content_h3}>
											{children}
										</h3>
									),
									'heading-4': (node, children) => (
										<h4 className={styles.blogDetail__content_h4}>
											{children}
										</h4>
									),
									'heading-5': (node, children) => (
										<h5 className={styles.blogDetail__content_h5}>
											{children}
										</h5>
									),
									'heading-6': (node, children) => (
										<h6 className={styles.blogDetail__content_h6}>
											{children}
										</h6>
									),
									paragraph: (node, children) => (
										<p className={styles.blogDetail__content_p}>{children}</p>
									),
									'list-item': (node, children) => (
										<li className={styles.blogDetail__content_li}>
											{children}
										</li>
									),
									'ordered-list': (node, children) => (
										<ol className={styles.blogDetail__content_ol}>
											{children}
										</ol>
									),
									'unordered-list': (node, children) => (
										<ul className={styles.blogDetail__content_ul}>
											{children}
										</ul>
									),
									blockquote: (node, children) => (
										<blockquote
											className={styles.blogDetail__content_blockquote}
										>
											{children}
										</blockquote>
									),
									hyperlink: (node, children) => (
										<a
											href={node.data.uri}
											className={styles.blogDetail__content_link}
											target="_blank"
											rel="noopener noreferrer"
										>
											{children}
										</a>
									),
									'embedded-asset-block': (node) => {
										const asset = post.content?.links?.assets?.block?.find(
											(asset: any) => asset.sys.id === node.data.target.sys.id
										);
										if (asset) {
											return (
												<figure className={styles.blogDetail__content_image}>
													<Image
														src={asset.url}
														alt={asset.title || 'Blog image'}
														width={800}
														height={600}
														className={styles.blogDetail__content_img}
													/>
													{asset.description && (
														<figcaption
															className={styles.blogDetail__content_caption}
														>
															{asset.description}
														</figcaption>
													)}
												</figure>
											);
										}
										return null;
									},
								},
							})
						) : (
							<div className={styles.blogDetail__content_empty}>
								<p>No content available for this article.</p>
							</div>
						)}
					</motion.article>
					<div className={styles.blogDetail__toc_wrapper}>
						<TableOfContents className={styles.blogDetail__toc} />
					</div>
				</div>
				{relatedPosts.length > 0 && (
					<motion.section
						className={styles.blogDetail__related}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 1.3 }}
					>
						<h2 className={styles.blogDetail__related_title}>
							Related Articles
						</h2>
						<div className={styles.blogDetail__related_grid}>
							{relatedPosts.map((relatedPost, index) => (
								<motion.div
									key={relatedPost.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
								>
									<BlogCard post={relatedPost} />
								</motion.div>
							))}
						</div>
					</motion.section>
				)}
				<Subscribe delay={1.6} />
			</motion.div>
		</div>
	);
};

export default BlogDetail;
