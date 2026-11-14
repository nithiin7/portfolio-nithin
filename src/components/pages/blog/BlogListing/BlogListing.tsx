'use client';
import { useLenis } from 'lenis/react';
import Link from 'next/link';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import {
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	type FC,
	type ReactElement,
} from 'react';

import RevealText from 'components/motion/RevealText/RevealText';
import BlogFeatured from 'components/pages/blog/BlogFeatured/BlogFeatured';
import BlogRow from 'components/pages/blog/BlogRow/BlogRow';
import Subscribe from 'components/utilities/Subscribe/Subscribe';
import { EXTERNAL_ARROW } from 'constants/index';
import {
	filterPosts,
	isFiltering,
	type CategoryCount,
} from 'helpers/blogPosts';
import type { BlogPost } from 'types/blog';

import styles from './BlogListing.module.scss';

interface BlogListingProps {
	posts: BlogPost[];
	categories: CategoryCount[];
}

const ELSEWHERE = [
	{ label: 'Medium', href: 'https://medium.com/@nithiin7' },
	{ label: 'DEV', href: 'https://dev.to/nithiin7' },
] as const;

const pad = (n: number): string => String(n).padStart(2, '0');

/** Blog index with search, category and tag filters. */
const BlogListing: FC<BlogListingProps> = ({
	posts,
	categories,
}): ReactElement => {
	const searchId = useId();
	const lenis = useLenis();
	const filtersRef = useRef<HTMLDivElement>(null);
	const anchorTop = useRef<number | null>(null);
	const [category, setCategory] = useQueryState('category', parseAsString);
	const [tags, setTags] = useQueryState(
		'tag',
		parseAsArrayOf(parseAsString).withDefault([])
	);
	const [query, setQuery] = useQueryState(
		'q',
		parseAsString.withDefault('').withOptions({ throttleMs: 300 })
	);

	const filter = { category, tags, query };
	const filtering = isFiltering(filter);
	const matches = useMemo(
		() => filterPosts(posts, { category, tags, query }),
		[posts, category, tags, query]
	);
	const featured = filtering ? undefined : posts[0];
	const list = featured ? matches.slice(1) : matches;

	const anchorFilters = (): void => {
		anchorTop.current = filtersRef.current?.getBoundingClientRect().top ?? null;
	};

	useLayoutEffect(() => {
		const before = anchorTop.current;
		const filters = filtersRef.current;
		anchorTop.current = null;
		if (before === null || !filters) return;
		const delta = filters.getBoundingClientRect().top - before;
		if (Math.abs(delta) < 1) return;
		const target = window.scrollY + delta;
		if (lenis) {
			lenis.resize();
			lenis.scrollTo(target, { immediate: true, force: true });
		} else {
			window.scrollTo(0, target);
		}
	}, [category, tags, query, lenis]);

	const clearAll = (): void => {
		anchorFilters();
		void setCategory(null);
		void setTags(null);
		void setQuery(null);
	};

	const status = filtering
		? `${matches.length} of ${posts.length} articles`
		: `${posts.length} articles`;

	return (
		<div className={styles.Blog}>
			<header className={styles.Blog__hero}>
				<div className={styles.Blog__topline}>
					<p className={styles.Blog__kicker}>
						Journal{' '}
						<span className={styles.Blog__tabular}>({pad(posts.length)})</span>
					</p>
					<ul className={styles.Blog__elsewhere} aria-label="Elsewhere">
						{ELSEWHERE.map((item) => (
							<li key={item.href}>
								<a
									href={item.href}
									target="_blank"
									rel="noopener noreferrer"
									className={styles.Blog__mono}
								>
									{item.label}
									<span aria-hidden="true"> {EXTERNAL_ARROW}</span>
									<span className={styles.Blog__sr}> (opens in a new tab)</span>
								</a>
							</li>
						))}
						<li>
							<Link href="/rss" className={styles.Blog__mono}>
								RSS
							</Link>
						</li>
					</ul>
				</div>

				<RevealText as="h1" trigger="mount" className={styles.Blog__title}>
					Writing
				</RevealText>
				<RevealText
					as="p"
					trigger="mount"
					delay={0.2}
					className={styles.Blog__lede}
				>
					Field notes on AI agents, MCP and the web platform: what I learned
					shipping them, written for whoever builds next.
				</RevealText>
			</header>

			<div className={styles.Blog__inner}>
				{featured && <BlogFeatured post={featured} />}

				<section className={styles.Blog__index} aria-labelledby="index-title">
					<div className={styles.Blog__indexHead}>
						<h2 id="index-title" className={styles.Blog__indexTitle}>
							{featured ? 'Earlier' : 'Index'}
						</h2>
						<p className={styles.Blog__count} role="status" aria-live="polite">
							{status}
						</p>
					</div>

					<div ref={filtersRef} className={styles.Blog__filters}>
						<div
							className={styles.Blog__categories}
							role="group"
							aria-label="Filter by category"
						>
							<button
								type="button"
								className={styles.Blog__chip}
								aria-pressed={!category}
								onClick={() => {
									anchorFilters();
									void setCategory(null);
								}}
							>
								All{' '}
								<span className={styles.Blog__chipCount}>{posts.length}</span>
							</button>
							{categories.map((item) => (
								<button
									key={item.name}
									type="button"
									className={styles.Blog__chip}
									aria-pressed={category === item.name}
									onClick={() => {
										anchorFilters();
										void setCategory(category === item.name ? null : item.name);
									}}
								>
									{item.name}{' '}
									<span className={styles.Blog__chipCount}>{item.count}</span>
								</button>
							))}
						</div>

						<div className={styles.Blog__search}>
							<label htmlFor={searchId} className={styles.Blog__sr}>
								Search articles
							</label>
							<input
								id={searchId}
								type="search"
								className={styles.Blog__searchInput}
								placeholder="Search articles"
								value={query}
								onChange={(event) => {
									anchorFilters();
									void setQuery(event.target.value || null);
								}}
								autoComplete="off"
								spellCheck={false}
							/>
						</div>
					</div>

					{tags.length > 0 && (
						<ul className={styles.Blog__active} aria-label="Active tag filters">
							{tags.map((tag) => (
								<li key={tag}>
									<button
										type="button"
										className={styles.Blog__chip}
										aria-pressed
										aria-label={`Remove tag filter ${tag}`}
										onClick={() => {
											anchorFilters();
											const next = tags.filter((t) => t !== tag);
											void setTags(next.length ? next : null);
										}}
									>
										#{tag} <span aria-hidden="true">×</span>
									</button>
								</li>
							))}
						</ul>
					)}

					{list.length > 0 ? (
						<ol className={styles.Blog__list}>
							{list.map((post) => (
								<li key={post.id}>
									<BlogRow post={post} />
								</li>
							))}
						</ol>
					) : filtering ? (
						<div className={styles.Blog__empty}>
							<p className={styles.Blog__emptyTitle}>
								Nothing matches that filter.
							</p>
							<button
								type="button"
								className={styles.Blog__reset}
								onClick={clearAll}
							>
								Clear filters
							</button>
						</div>
					) : !featured ? (
						<p className={styles.Blog__emptyTitle}>
							No articles yet. Check back soon, or{' '}
							<Link href="/contact">say hello</Link>.
						</p>
					) : null}
				</section>

				<Subscribe />
			</div>
		</div>
	);
};

export default BlogListing;
