import type { FC, ReactElement } from 'react';
import { SiHuggingface } from 'react-icons/si';

import {
	CountUp,
	StatCard,
	StatCardDivider,
	StatMetric,
} from 'components/pages';
import type { HuggingFaceStats } from 'types/huggingface';

import styles from './HuggingFaceStatCard.module.scss';

interface HuggingFaceStatCardProps {
	stats: HuggingFaceStats | null;
}

const HuggingFaceStatCard: FC<HuggingFaceStatCardProps> = ({
	stats,
}): ReactElement | null => {
	if (!stats) return null;

	const isRunning = stats.stage === 'RUNNING';

	return (
		<StatCard
			icon={<SiHuggingface />}
			title="Hugging Face"
			subtitle="AI resume chatbot"
			href={stats.url}
			linkLabel="Open Hugging Face Space"
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
				An AI chatbot trained on my resume — ask it anything via the chat bubble
				in the corner.
			</p>
		</StatCard>
	);
};

export default HuggingFaceStatCard;
