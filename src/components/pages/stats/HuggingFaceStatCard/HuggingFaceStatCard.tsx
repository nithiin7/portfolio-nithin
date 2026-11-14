import type { FC, ReactElement } from 'react';

import CountUp from 'components/pages/stats/CountUp/CountUp';
import StatCard, {
	StatCardDivider,
} from 'components/pages/stats/StatCard/StatCard';
import StatMetric from 'components/pages/stats/StatMetric/StatMetric';
import type { HuggingFaceStats } from 'types/huggingface';

import styles from './HuggingFaceStatCard.module.scss';

interface HuggingFaceStatCardProps {
	stats: HuggingFaceStats | null;
}

/** Hugging Face Space likes and status. */
const HuggingFaceStatCard: FC<HuggingFaceStatCardProps> = ({
	stats,
}): ReactElement | null => {
	if (!stats) return null;

	const isRunning = stats.stage === 'RUNNING';

	return (
		<StatCard
			title="Hugging Face"
			subtitle="AI resume chatbot"
			href={stats.url}
			linkLabel="Space"
			live={isRunning}
		>
			<StatMetric value={<CountUp value={stats.likes} />} label="Space likes" />
			<div className={styles.HuggingFaceStatCard__status}>
				<span
					className={`${styles.HuggingFaceStatCard__dot} ${
						isRunning ? styles['HuggingFaceStatCard__dot--running'] : ''
					}`}
					aria-hidden="true"
				/>
				Space {stats.stage.toLowerCase().replace(/_/g, ' ')}
			</div>
			<StatCardDivider />
			<p className={styles.HuggingFaceStatCard__note}>
				An AI chatbot trained on my resume. Ask it anything via the chat bubble
				in the corner.
			</p>
		</StatCard>
	);
};

export default HuggingFaceStatCard;
