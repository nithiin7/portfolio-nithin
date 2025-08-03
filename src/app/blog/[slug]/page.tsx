'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { useState, useEffect, use } from 'react';

import { BlogNavbar } from 'components/layouts';
import { BlogCard } from 'components/pages';
import {
	MaskText,
	RichTextRenderer,
	TableOfContents,
	Subscribe,
} from 'components/utilities';
import { blogData } from 'constants/blogData';
import { formatDate, getRelatedPosts } from 'helpers/blog';
import type { BlogPost } from 'types/blog';

import styles from './page.module.scss';

interface BlogDetailPageProps {
	params: Promise<{
		slug: string;
	}>;
}

/**
 * Blog detail page component with modern animations and design
 */
const BlogDetailPage: FC<BlogDetailPageProps> = ({ params }) => {
	const [post, setPost] = useState<BlogPost | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const { slug } = use(params);

	useEffect(() => {
		const foundPost = blogData.find((p) => p.slug === slug);
		setTimeout(() => {
			setPost(foundPost || null);
			setIsLoading(false);
		}, 500);
	}, [slug]);

	const testPost: BlogPost = {
		id: 'test-post-1',
		title:
			'What is Agentic AI? Understanding the Future of Autonomous Intelligence',
		slug: 'what-is-agentic-ai',
		excerpt:
			'In the ever-evolving landscape of technology, new buzzwords and innovations emerge with the promise of reshaping our world. One such breakthrough is agentic AI. But what exactly is agentic AI, and why is it capturing the attention of technology business owners, college students, copywriters, and programmers alike?',
		content: `
			<p>In the ever-evolving landscape of technology, new buzzwords and innovations emerge with the promise of reshaping our world. One such breakthrough is agentic AI. But what exactly is agentic AI, and why is it capturing the attention of technology business owners, college students, copywriters, and programmers alike? In this blog, we'll dive deep into the concept of agentic AI, explore its potential applications, and discuss how it might change the way we work.</p>
			
			<h2>Defining Agentic AI</h2>
			<p>Agentic AI refers to artificial intelligence systems that possess a degree of autonomy and agency. Unlike traditional AI models that require explicit instructions for every task, agentic AI is designed to act independently by setting its own goals, making decisions, and even adapting its behavior based on real-time data. This means that instead of waiting for human input at every step, an agentic AI can proactively respond to changing circumstances and solve problems on its own.</p>
			
			<h2>Why Agentic AI Matters</h2>
			<p>The significance of agentic AI lies in its ability to operate with a level of independence that traditional AI systems lack. While conventional AI excels at specific tasks when given clear instructions, agentic AI can take initiative, learn from its environment, and make decisions that align with broader objectives. This autonomy makes it particularly valuable in complex, dynamic environments where conditions change rapidly.</p>
			
			<p>For businesses, this means AI systems that can manage entire workflows without constant supervision. For developers, it opens up new possibilities for creating more intelligent and responsive applications. And for end-users, it promises more seamless and intuitive interactions with technology.</p>
			
			<h2>The Core Benefits of Agentic AI</h2>
			<p>Agentic AI offers several key advantages that make it a game-changer in the technology landscape:</p>
			
			<h3>1. Autonomous Decision Making</h3>
			<p>Agentic AI can make decisions based on its understanding of goals and context, rather than requiring step-by-step instructions. This autonomy allows it to handle complex scenarios and adapt to changing conditions in real-time.</p>
			
			<h3>2. Proactive Problem Solving</h3>
			<p>Instead of waiting for problems to be identified and instructions to be given, agentic AI can proactively identify issues and take action to resolve them. This proactive approach can prevent problems before they escalate and improve overall system performance.</p>
			
			<h3>3. Continuous Learning and Adaptation</h3>
			<p>Agentic AI systems can learn from their experiences and adapt their strategies over time. This continuous learning capability means they become more effective and efficient as they gain more experience in their domain.</p>
			
			<h3>4. Goal-Oriented Behavior</h3>
			<p>These AI systems operate with a clear understanding of their objectives and can work towards achieving those goals even when the path forward isn't immediately obvious. This goal-oriented approach makes them more reliable and predictable in their behavior.</p>
			
			<h2>Agentic AI in Action</h2>
			<p>To better understand how agentic AI works in practice, let's look at some real-world examples:</p>
			
			<h3>Customer Service Automation</h3>
			<p>Imagine a customer service AI that doesn't just respond to specific questions but can understand the customer's overall situation, anticipate their needs, and take proactive steps to resolve their issues. This AI might notice patterns in customer complaints and automatically implement solutions before similar issues arise for other customers.</p>
			
			<h3>Content Creation and Management</h3>
			<p>An agentic AI content manager could analyze market trends, audience engagement, and content performance to automatically adjust content strategies, create new content pieces, and optimize existing content for better performance.</p>
			
			<h3>Software Development</h3>
			<p>In software development, agentic AI could take on entire development tasks, from analyzing requirements to writing code, testing, and deployment, all while learning from feedback and improving its approach over time.</p>
			
			<h2>Embracing the Future with Agentic AI</h2>
			<p>As we move forward, the integration of agentic AI into various industries will become increasingly common. For technology business owners, this means new opportunities to automate complex processes and create more intelligent products. For developers, it opens up new frontiers in AI development and application design.</p>
			
			<p>For students and professionals looking to stay ahead in the tech industry, understanding agentic AI is becoming essential. The ability to work with and develop these systems will be a valuable skill in the coming years.</p>
			
			<p>The future of agentic AI is not just about creating more intelligent machines—it's about creating AI systems that can work alongside humans as true partners, taking initiative when appropriate and supporting human goals and objectives. As we continue to develop and refine these technologies, we're moving closer to a world where AI can truly augment human capabilities in meaningful and transformative ways.</p>
		`,
		featuredImage:
			'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
		category: 'Artificial Intelligence',
		tags: ['AI', 'Machine Learning', 'Technology', 'Future'],
		author: {
			name: 'Revo Admin',
			avatar:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
		},
		publishedAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z',
		readTime: 3,
		seo: {
			title:
				'What is Agentic AI? Understanding the Future of Autonomous Intelligence',
			description:
				'Explore the concept of agentic AI and how it is shaping the future of autonomous intelligence.',
			keywords: [
				'agentic AI',
				'artificial intelligence',
				'autonomous systems',
				'technology',
			],
		},
	};

	const currentPost = post || testPost;

	// Social sharing functions
	const shareOnFacebook = () => {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(currentPost.title);
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
			'_blank'
		);
	};

	const shareOnTwitter = () => {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(currentPost.title);
		window.open(
			`https://twitter.com/intent/tweet?url=${url}&text=${text}`,
			'_blank'
		);
	};

	const shareOnLinkedIn = () => {
		const url = encodeURIComponent(window.location.href);
		const title = encodeURIComponent(currentPost.title);
		const summary = encodeURIComponent(currentPost.excerpt);
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`,
			'_blank'
		);
	};

	const shareOnWhatsApp = () => {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(
			`${currentPost.title} - ${currentPost.excerpt}`
		);
		window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
	};

	if (isLoading) {
		return (
			<div className={styles.blogDetail}>
				<BlogNavbar />
				<motion.div
					className={styles.blogDetail__loading}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<div className={styles.blogDetail__loading_spinner} />
					<p>Loading article...</p>
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
					{currentPost.featuredImage && (
						<div className={styles.blogDetail__hero_background}>
							<Image
								src={currentPost.featuredImage}
								alt={currentPost.title}
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
							{currentPost.category}
						</motion.div>
						<motion.h1
							className={styles.blogDetail__title}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.5 }}
						>
							<MaskText phrases={[currentPost.title]} />
						</motion.h1>
						<motion.p
							className={styles.blogDetail__excerpt}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
						>
							{currentPost.excerpt}
						</motion.p>
						<motion.div
							className={styles.blogDetail__meta}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.7 }}
						>
							<div className={styles.blogDetail__meta_author}>
								{currentPost.author.avatar && (
									<Image
										src={currentPost.author.avatar}
										alt={currentPost.author.name}
										width={32}
										height={32}
										className={styles.blogDetail__meta_avatar}
									/>
								)}
								<span className={styles.blogDetail__meta_name}>
									{currentPost.author.name}
								</span>
							</div>
							<div className={styles.blogDetail__meta_info}>
								<span className={styles.blogDetail__meta_readtime}>
									{currentPost.readTime} Mins. Read
								</span>
								<span className={styles.blogDetail__meta_date}>
									{formatDate(currentPost.publishedAt, 'long')}
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
				{currentPost.tags.length > 0 && (
					<motion.section
						className={styles.blogDetail__tags}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.9 }}
					>
						{currentPost.tags.map((tag, index) => (
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
						<RichTextRenderer content={currentPost.content} />
					</motion.article>
					<div className={styles.blogDetail__toc_wrapper}>
						<TableOfContents className={styles.blogDetail__toc} />
					</div>
				</div>
				<motion.section
					className={styles.blogDetail__related}
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.3 }}
				>
					<h2 className={styles.blogDetail__related_title}>Related Articles</h2>
					<div className={styles.blogDetail__related_grid}>
						{getRelatedPosts(currentPost, blogData, 3).map(
							(relatedPost, index) => (
								<motion.div
									key={relatedPost.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
								>
									<BlogCard post={relatedPost} />
								</motion.div>
							)
						)}
					</div>
				</motion.section>
				<Subscribe delay={1.6} />
			</motion.div>
		</div>
	);
};

export default BlogDetailPage;
