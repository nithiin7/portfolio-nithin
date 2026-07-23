import type { FC, ReactElement } from 'react';
import { SiDevdotto } from 'react-icons/si';

import {
	CountUp,
	StatCard,
	StatCardDivider,
	StatCardSection,
	StatMetric,
} from 'components/pages';
import { DEVTO_USERNAME } from 'constants/index';
import { formatDate } from 'helpers';
import type { DevToStats } from 'types/devto';

import styles from './DevToStatCard.module.scss';

interface DevToStatCardProps {
	stats: DevToStats | null;
}

const DevToStatCard: FC<DevToStatCardProps> = ({
	stats,
}): ReactElement | null => {
	if (!stats) return null;

	return (
		<StatCard
			icon={<SiDevdotto />}
			title="Dev.to"
			subtitle={`@${DEVTO_USERNAME}`}
			href={`https://dev.to/${DEVTO_USERNAME}`}
			linkLabel="Open Dev.to profile"
		>
			<div className={styles.DevToStatCard__metrics}>
				<StatMetric
					value={<CountUp value={stats.totalArticles} />}
					label="Articles"
				/>
				<StatMetric
					value={<CountUp value={stats.totalReactions} />}
					label="Reactions"
				/>
				<StatMetric
					value={<CountUp value={stats.totalComments} />}
					label="Comments"
				/>
			</div>
			<StatCardDivider />
			<StatCardSection>Latest article</StatCardSection>
			<div className={styles.DevToStatCard__latest}>
				<a
					href={stats.latest.url}
					target="_blank"
					rel="noopener noreferrer"
					title={stats.latest.title}
				>
					{stats.latest.title}
				</a>
				<span>
					{stats.latest.reactionsCount} reactions · {stats.latest.commentsCount}{' '}
					comments · {formatDate(stats.latest.publishedAt, 'relative')}
				</span>
			</div>
		</StatCard>
	);
};

export default DevToStatCard;
