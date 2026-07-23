'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { useRef, type FC, type ReactElement, type ReactNode } from 'react';

import {
	BlogStatCard,
	CountUp,
	DevToStatCard,
	GithubStatCard,
	HuggingFaceStatCard,
	StatTile,
	WakaTimeStatCard,
} from 'components/pages';
import {
	MaskText,
	PortfolioAnimations,
	StaggeredContainer,
} from 'components/utilities';
import type { BlogStats } from 'types/blog';
import type { DevToStats } from 'types/devto';
import type { GithubStats } from 'types/github';
import type { HuggingFaceStats } from 'types/huggingface';
import type { WakaTimeStats } from 'types/wakatime';

import styles from './Stats.module.scss';

interface StatsProps {
	github: GithubStats | null;
	wakatime: WakaTimeStats | null;
	devto: DevToStats | null;
	huggingface: HuggingFaceStats | null;
	blog: BlogStats | null;
}

interface StatsCell {
	key: string;
	span: 'wide' | 'medium' | 'small' | 'compact';
	node: ReactNode;
}

const Stats: FC<StatsProps> = ({
	github,
	wakatime,
	devto,
	huggingface,
	blog,
}): ReactElement => {
	const ref = useRef(null);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	});

	const scale = useTransform(scrollYProgress, [0.7, 1], [1, 0.9]);
	const y = useTransform(scrollYProgress, [0.6, 1], [0, -100]);

	const codingHours = wakatime
		? Math.round((wakatime.totalSeconds / 3600) * 10) / 10
		: 0;

	const tiles = [
		wakatime && (
			<StatTile
				key="hours"
				label="Coded this week"
				value={<CountUp value={codingHours} decimals={1} suffix="h" />}
				note={`${wakatime.humanReadableDailyAverage} daily average`}
			/>
		),
		github && (
			<StatTile
				key="repos"
				label="Public repos"
				value={<CountUp value={github.repoCount} />}
				note={
					github.followers !== null
						? `${github.followers} followers`
						: undefined
				}
			/>
		),
		github && (
			<StatTile
				key="stars"
				label="GitHub stars"
				value={<CountUp value={github.totalStars} />}
				note={`across ${github.repoCount} repos`}
			/>
		),
		blog && (
			<StatTile
				key="views"
				label="Blog views"
				value={<CountUp value={blog.totalViews} compact />}
				note={`${blog.totalComments} comments`}
			/>
		),
	].filter(Boolean);

	const cells: StatsCell[] = [
		wakatime && {
			key: 'wakatime',
			span: 'wide' as const,
			node: <WakaTimeStatCard stats={wakatime} />,
		},
		github && {
			key: 'github',
			span: 'medium' as const,
			node: <GithubStatCard stats={github} />,
		},
		blog && {
			key: 'blog',
			span: 'medium' as const,
			node: <BlogStatCard stats={blog} />,
		},
		devto && {
			key: 'devto',
			span: 'small' as const,
			node: <DevToStatCard stats={devto} />,
		},
		huggingface && {
			key: 'huggingface',
			span: 'compact' as const,
			node: <HuggingFaceStatCard stats={huggingface} />,
		},
	].filter(Boolean) as StatsCell[];

	return (
		<motion.div
			ref={ref}
			className={styles.Stats}
			style={{ y, scale, transformStyle: 'preserve-3d' }}
		>
			<section>
				<div className={styles.Stats__header}>
					<Link href="/" className={styles.Stats__back}>
						← &nbsp;Back home
					</Link>
					<span className={styles.Stats__badge}>
						<span className={styles.Stats__badgeDot} aria-hidden="true" />
						Live data · refreshed hourly
					</span>
					<h1>
						<MaskText phrases={['Live Stats']} />
					</h1>
					<p>
						A real-time look at what I&apos;m building, writing, and shipping —
						pulled straight from GitHub, WakaTime, Dev.to, and this site.
					</p>
				</div>
				{tiles.length > 0 && (
					<StaggeredContainer className={styles.Stats__tiles}>
						{tiles}
					</StaggeredContainer>
				)}
				<div className={styles.Stats__grid}>
					{cells.map((cell, index) => (
						<PortfolioAnimations
							key={cell.key}
							animation="slideUp"
							delay={index * 0.08}
							className={`${styles.Stats__cell} ${styles[`Stats__cell--${cell.span}`]}`}
						>
							{cell.node}
						</PortfolioAnimations>
					))}
				</div>
			</section>
		</motion.div>
	);
};

export default Stats;
