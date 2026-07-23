import Link from 'next/link';
import type { FC, ReactElement } from 'react';
import { FaChartBar } from 'react-icons/fa';

import {
	CountUp,
	StatCard,
	StatCardDivider,
	StatCardSection,
	StatMetric,
} from 'components/pages';
import { formatCompactNumber } from 'helpers';
import type { BlogStats } from 'types/blog';

import styles from './BlogStatCard.module.scss';

interface BlogStatCardProps {
	stats: BlogStats | null;
}

const BlogStatCard: FC<BlogStatCardProps> = ({
	stats,
}): ReactElement | null => {
	if (!stats) return null;

	return (
		<StatCard icon={<FaChartBar />} title="Blog" subtitle="On this site" live>
			<div className={styles.BlogStatCard__metrics}>
				<StatMetric
					value={<CountUp value={stats.totalViews} compact />}
					label="Total views"
				/>
				<StatMetric
					value={<CountUp value={stats.totalComments} />}
					label="Comments"
				/>
			</div>
			{stats.topPosts.length > 0 && (
				<>
					<StatCardDivider />
					<StatCardSection>Most read</StatCardSection>
					<ol className={styles.BlogStatCard__posts}>
						{stats.topPosts.map((post, index) => (
							<li key={post.slug}>
								<span className={styles.BlogStatCard__rank}>
									{String(index + 1).padStart(2, '0')}
								</span>
								<Link href={`/blog/${post.slug}`} title={post.title}>
									{post.title}
								</Link>
								<span className={styles.BlogStatCard__views}>
									{formatCompactNumber(post.viewCount)} views
								</span>
							</li>
						))}
					</ol>
				</>
			)}
		</StatCard>
	);
};

export default BlogStatCard;
