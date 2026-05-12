'use client';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { toast } from 'sonner';

import { WhatsAppIcon } from 'assets/icons';
import { BlogCard, CommentSection, TableOfContents } from 'components/pages';
import { MaskText, Subscribe, Tag, TagContainer } from 'components/utilities';
import {
	formatDate,
	shareOnFacebook,
	shareOnTwitter,
	shareOnLinkedIn,
	shareOnWhatsApp,
} from 'helpers';
import type { BlogPost } from 'types/blog';

import styles from './BlogDetail.module.scss';

interface BlogDetailProps {
	post: BlogPost;
	relatedPosts: BlogPost[];
}

const BlogDetail: FC<BlogDetailProps> = ({ post, relatedPosts }) => {
	const [readProgress, setReadProgress] = useState(0);
	const [showShareRail, setShowShareRail] = useState(false);
	const [showBackToTop, setShowBackToTop] = useState(false);
	const [linkCopied, setLinkCopied] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const article = document.querySelector('article');
			if (!article) return;
			const articleTop = article.offsetTop;
			const articleHeight = article.scrollHeight;
			const scrolled = window.scrollY - articleTop + window.innerHeight * 0.8;
			setReadProgress(
				Math.min(100, Math.max(0, (scrolled / articleHeight) * 100))
			);
			setShowShareRail(window.scrollY > articleTop - 120);
			setShowBackToTop(window.scrollY > 400);
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleShareOnFacebook = () => {
		if (!post) return;
		shareOnFacebook({
			url: window.location.href,
			title: post.title,
			description: post.excerpt,
		});
	};

	const handleShareOnTwitter = () => {
		if (!post) return;
		shareOnTwitter({
			url: window.location.href,
			title: post.title,
			description: post.excerpt,
		});
	};

	const handleShareOnLinkedIn = () => {
		if (!post) return;
		shareOnLinkedIn({
			url: window.location.href,
			title: post.title,
			description: post.excerpt,
		});
	};

	const handleShareOnWhatsApp = () => {
		if (!post) return;
		shareOnWhatsApp({
			url: window.location.href,
			title: post.title,
			description: post.excerpt,
		});
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(window.location.href);
		toast.success('Link copied to clipboard');
		setLinkCopied(true);
		setTimeout(() => setLinkCopied(false), 2000);
	};

	if (!post) {
		return (
			<div className={styles.BlogDetail}>
				<motion.div
					className={styles.BlogDetail__container}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
				>
					<motion.nav
						className={styles.BlogDetail__breadcrumb}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<Link href="/blog" className={styles.BlogDetail__breadcrumb_link}>
							← &nbsp;Back to Blog
						</Link>
					</motion.nav>
					<div className={styles.BlogDetail__error}>
						<h1>Article Not Found</h1>
						<p>
							The article you're looking for doesn't exist or has been removed.
						</p>
						<Link href="/blog" className={styles.BlogDetail__error_link}>
							Back to Blog
						</Link>
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className={styles.BlogDetail}>
			<div
				className={styles.BlogDetail__progress}
				style={{ width: `${readProgress}%` }}
			/>
			<motion.div
				className={styles.BlogDetail__share_rail}
				initial={{ opacity: 0, x: -16 }}
				animate={{ opacity: showShareRail ? 1 : 0, x: showShareRail ? 0 : -16 }}
				transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
				style={{ pointerEvents: showShareRail ? 'auto' : 'none' }}
				aria-hidden={!showShareRail}
			>
				<button
					onClick={handleShareOnFacebook}
					className={`${styles.BlogDetail__rail_button} ${styles.BlogDetail__rail_button_facebook}`}
					aria-label="Share on Facebook"
				>
					f
				</button>
				<button
					onClick={handleShareOnTwitter}
					className={`${styles.BlogDetail__rail_button} ${styles.BlogDetail__rail_button_twitter}`}
					aria-label="Share on Twitter"
				>
					𝕏
				</button>
				<button
					onClick={handleShareOnLinkedIn}
					className={`${styles.BlogDetail__rail_button} ${styles.BlogDetail__rail_button_linkedin}`}
					aria-label="Share on LinkedIn"
				>
					in
				</button>
				<button
					onClick={handleShareOnWhatsApp}
					className={`${styles.BlogDetail__rail_button} ${styles.BlogDetail__rail_button_whatsapp}`}
					aria-label="Share on WhatsApp"
				>
					<WhatsAppIcon />
				</button>
				<button
					onClick={handleCopyLink}
					className={`${styles.BlogDetail__rail_button} ${styles.BlogDetail__rail_button_copy}`}
					aria-label="Copy link"
				>
					{linkCopied ? (
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
					) : (
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
							<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
						</svg>
					)}
				</button>
			</motion.div>
			<motion.button
				className={styles.BlogDetail__back_to_top}
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: showBackToTop ? 1 : 0, y: showBackToTop ? 0 : 16 }}
				transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
				style={{ pointerEvents: showBackToTop ? 'auto' : 'none' }}
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				aria-label="Back to top"
			>
				↑
			</motion.button>
			<motion.div
				className={styles.BlogDetail__container}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
			>
				<motion.nav
					className={styles.BlogDetail__breadcrumb}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Link href="/blog" className={styles.BlogDetail__breadcrumb_link}>
						← &nbsp;Back to Blog
					</Link>
				</motion.nav>
				<motion.section
					className={styles.BlogDetail__hero}
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				>
					{post.featuredImage && (
						<div className={styles.BlogDetail__hero_background}>
							<Image
								src={post.featuredImage.url}
								alt={post.featuredImage.title || post.title}
								fill
								className={styles.BlogDetail__hero_bg_image}
								priority
							/>
							<div className={styles.BlogDetail__hero_overlay} />
						</div>
					)}
					<div className={styles.BlogDetail__hero_content}>
						<motion.div
							className={styles.BlogDetail__category}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							{post.category}
						</motion.div>
						<motion.h1
							className={styles.BlogDetail__title}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.5 }}
						>
							<MaskText phrases={[post.title]} />
						</motion.h1>
						<motion.p
							className={styles.BlogDetail__excerpt}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
						>
							{post.excerpt}
						</motion.p>
					</div>
				</motion.section>
				<motion.div
					className={styles.BlogDetail__byline}
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.7 }}
				>
					<div className={styles.BlogDetail__byline_author}>
						{post.authorAvatar && (
							<Image
								src={post.authorAvatar.url}
								alt={post.authorAvatar.title || post.authorName}
								width={36}
								height={36}
								className={styles.BlogDetail__byline_avatar}
							/>
						)}
						<span className={styles.BlogDetail__byline_name}>
							{post.authorName}
						</span>
					</div>
					<span className={styles.BlogDetail__byline_divider} />
					<span className={styles.BlogDetail__byline_readtime}>
						{post.readTime} min read
					</span>
					<span className={styles.BlogDetail__byline_divider} />
					<span className={styles.BlogDetail__byline_date}>
						{formatDate(post.publishedAt, 'long')}
					</span>
				</motion.div>
				{post.tags.length > 0 && (
					<TagContainer delay={0.9}>
						{post.tags.map((tag, index) => (
							<Tag
								key={tag}
								variant="secondary"
								size="medium"
								delay={1.0 + index * 0.1}
							>
								{tag}
							</Tag>
						))}
					</TagContainer>
				)}
				<div className={styles.BlogDetail__content_wrapper}>
					<motion.article
						className={styles.BlogDetail__content}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 1.1 }}
					>
						{post.content?.json ? (
							<>
								{(() => {
									let isFirstParagraph = true;
									return documentToReactComponents(post.content.json, {
										renderNode: {
											'heading-1': (_node, children) => (
												<h1 className={styles.BlogDetail__content_h1}>
													{children}
												</h1>
											),
											'heading-2': (_node, children) => (
												<h2 className={styles.BlogDetail__content_h2}>
													{children}
												</h2>
											),
											'heading-3': (_node, children) => (
												<h3 className={styles.BlogDetail__content_h3}>
													{children}
												</h3>
											),
											'heading-4': (_node, children) => (
												<h4 className={styles.BlogDetail__content_h4}>
													{children}
												</h4>
											),
											'heading-5': (_node, children) => (
												<h5 className={styles.BlogDetail__content_h5}>
													{children}
												</h5>
											),
											'heading-6': (_node, children) => (
												<h6 className={styles.BlogDetail__content_h6}>
													{children}
												</h6>
											),
											paragraph: (_node, children) => {
												if (isFirstParagraph) {
													isFirstParagraph = false;
													return (
														<p
															className={`${styles.BlogDetail__content_p} ${styles.BlogDetail__content_p_dropcap}`}
														>
															{children}
														</p>
													);
												}
												return (
													<p className={styles.BlogDetail__content_p}>
														{children}
													</p>
												);
											},
											'list-item': (_node, children) => (
												<li className={styles.BlogDetail__content_li}>
													{children}
												</li>
											),
											'ordered-list': (_node, children) => (
												<ol className={styles.BlogDetail__content_ol}>
													{children}
												</ol>
											),
											'unordered-list': (_node, children) => (
												<ul className={styles.BlogDetail__content_ul}>
													{children}
												</ul>
											),
											blockquote: (_node, children) => (
												<blockquote
													className={styles.BlogDetail__content_blockquote}
												>
													{children}
												</blockquote>
											),
											hyperlink: (_node, children) => (
												<a
													href={_node.data.uri}
													className={styles.BlogDetail__content_link}
													target="_blank"
													rel="noopener noreferrer"
												>
													{children}
												</a>
											),
											'embedded-asset-block': (node) => {
												const asset = post.content?.links?.assets?.block?.find(
													(asset: { sys: { id: string } }) =>
														asset.sys.id === node.data.target.sys.id
												);
												if (asset) {
													return (
														<figure
															className={styles.BlogDetail__content_image}
														>
															<Image
																src={asset.url}
																alt={asset.title || 'Blog image'}
																width={800}
																height={600}
																className={styles.BlogDetail__content_img}
															/>
															{asset.description && (
																<figcaption
																	className={styles.BlogDetail__content_caption}
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
									});
								})()}
								<div className={styles.BlogDetail__end_marker}>
									<span className={styles.BlogDetail__end_dot} />
									<span className={styles.BlogDetail__end_dot} />
									<span className={styles.BlogDetail__end_dot} />
								</div>
							</>
						) : (
							<div className={styles.BlogDetail__content_empty}>
								<p>No content available for this article.</p>
							</div>
						)}
					</motion.article>
					<div className={styles.BlogDetail__toc_wrapper}>
						<TableOfContents className={styles.BlogDetail__toc} />
					</div>
				</div>
				{relatedPosts.length > 0 && (
					<motion.section
						className={styles.BlogDetail__related}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 1.3 }}
					>
						<h2 className={styles.BlogDetail__related_title}>
							Related Articles
						</h2>
						<div className={styles.BlogDetail__related_grid}>
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
				<GoogleReCaptchaProvider
					reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
					scriptProps={{
						async: true,
						defer: true,
						appendTo: 'body',
						nonce: undefined,
					}}
				>
					<CommentSection postId={post.id} postSlug={post.slug} />
				</GoogleReCaptchaProvider>
			</motion.div>
		</div>
	);
};

export default BlogDetail;
