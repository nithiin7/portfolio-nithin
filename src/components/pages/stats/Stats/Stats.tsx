import type { FC, ReactElement, ReactNode } from 'react';

import RevealText from 'components/motion/RevealText/RevealText';
import BlogStatCard from 'components/pages/stats/BlogStatCard/BlogStatCard';
import CountUp from 'components/pages/stats/CountUp/CountUp';
import DevToStatCard from 'components/pages/stats/DevToStatCard/DevToStatCard';
import GithubStatCard from 'components/pages/stats/GithubStatCard/GithubStatCard';
import HuggingFaceStatCard from 'components/pages/stats/HuggingFaceStatCard/HuggingFaceStatCard';
import NowActivity from 'components/pages/stats/NowActivity/NowActivity';
import StatTile from 'components/pages/stats/StatTile/StatTile';
import WakaTimeStatCard from 'components/pages/stats/WakaTimeStatCard/WakaTimeStatCard';
import { packSpans } from 'helpers/grid';
import { buildNowActivity } from 'helpers/nowActivity';
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
	span: number;
	node: ReactNode;
}

const Stats: FC<StatsProps> = ({
	github,
	wakatime,
	devto,
	huggingface,
	blog,
}): ReactElement => {
	const codingHours = wakatime
		? Math.round((wakatime.totalSeconds / 3600) * 10) / 10
		: 0;

	const nowActivity = buildNowActivity(wakatime, github, devto);

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
			span: 7,
			node: <WakaTimeStatCard stats={wakatime} />,
		},
		github && {
			key: 'github',
			span: 5,
			node: <GithubStatCard stats={github} />,
		},
		blog && {
			key: 'blog',
			span: 5,
			node: <BlogStatCard stats={blog} />,
		},
		devto && {
			key: 'devto',
			span: 4,
			node: <DevToStatCard stats={devto} />,
		},
		huggingface && {
			key: 'huggingface',
			span: 3,
			node: <HuggingFaceStatCard stats={huggingface} />,
		},
	].filter(Boolean) as StatsCell[];
	const spans = packSpans(cells.map((cell) => cell.span));

	return (
		<div className={styles.Stats}>
			<header className={styles.Stats__hero}>
				<div className={styles.Stats__topline}>
					<p className={styles.Stats__kicker}>
						<span className={styles.Stats__dot} aria-hidden="true" />
						Live data
					</p>
					<p className={styles.Stats__kicker}>Refreshed every 30 min</p>
				</div>
				<RevealText as="h1" trigger="mount" className={styles.Stats__title}>
					Live stats
				</RevealText>
				<RevealText
					as="p"
					trigger="mount"
					delay={0.2}
					className={styles.Stats__lede}
				>
					What I&apos;m building, writing and shipping this week, pulled
					straight from GitHub, WakaTime, Dev.to and this site.
				</RevealText>
			</header>

			<div className={styles.Stats__inner}>
				<NowActivity items={nowActivity} />
				{tiles.length > 0 && (
					<section className={styles.Stats__tiles} aria-label="At a glance">
						{tiles}
					</section>
				)}
				<div className={styles.Stats__grid}>
					{cells.map((cell, index) => (
						<div
							key={cell.key}
							className={styles.Stats__cell}
							data-span={spans[index]}
						>
							{cell.node}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Stats;
