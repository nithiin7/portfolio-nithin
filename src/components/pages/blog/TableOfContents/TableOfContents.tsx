'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';

import styles from './TableOfContents.module.scss';

interface TableOfContentsProps {
	className?: string;
}

interface TocItem {
	id: string;
	text: string;
	level: number;
}

/**
 * TableOfContents component for blog articles
 * Automatically generates TOC from article headings (h1 and h2 only)
 */
const TableOfContents: FC<TableOfContentsProps> = ({ className }) => {
	const [headings, setHeadings] = useState<TocItem[]>([]);
	const [activeId, setActiveId] = useState<string>('');

	useEffect(() => {
		const articleContent = document.querySelector('article');
		if (!articleContent) return;

		const headingElements = articleContent.querySelectorAll('h1, h2');
		const tocItems: TocItem[] = [];

		headingElements.forEach((heading) => {
			const id =
				heading.id ||
				heading.textContent?.toLowerCase().replace(/\s+/g, '-') ||
				'';
			if (!id) return;

			if (!heading.id) {
				heading.id = id;
			}

			tocItems.push({
				id,
				text: heading.textContent || '',
				level: parseInt(heading.tagName.charAt(1)),
			});
		});

		setHeadings(tocItems);

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{
				rootMargin: '-20% 0px -35% 0px',
			}
		);

		headingElements.forEach((heading) => observer.observe(heading));

		return () => observer.disconnect();
	}, []);

	const scrollToHeading = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			const headerOffset = 120;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition =
				elementPosition + window.pageYOffset - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth',
			});

			setActiveId(id);
		}
	};

	if (headings.length === 0) {
		return null;
	}

	return (
		<motion.nav
			className={`${styles.TableOfContents} ${className || ''}`}
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6, delay: 0.8 }}
		>
			<div className={styles.TableOfContents__line} />
			<ul className={styles.TableOfContents__list}>
				{headings.map((heading) => (
					<motion.li
						key={heading.id}
						className={`${styles.TableOfContents__item} ${
							activeId === heading.id ? styles.TableOfContents__item_active : ''
						}`}
						whileHover={{ x: 4 }}
						transition={{ duration: 0.2 }}
					>
						<button
							className={styles.TableOfContents__link}
							onClick={() => scrollToHeading(heading.id)}
						>
							{heading.text}
						</button>
					</motion.li>
				))}
			</ul>
		</motion.nav>
	);
};

export default TableOfContents;
