import type { FC, ReactElement } from 'react';

import ActivityChart from 'components/pages/stats/ActivityChart/ActivityChart';
import MeterBar from 'components/pages/stats/MeterBar/MeterBar';
import StatCard, {
	StatCardDivider,
	StatCardMetrics,
	StatCardSection,
} from 'components/pages/stats/StatCard/StatCard';
import StatMetric from 'components/pages/stats/StatMetric/StatMetric';
import { formatDate } from 'helpers/format';
import type { WakaTimeStats } from 'types/wakatime';

import styles from './WakaTimeStatCard.module.scss';

interface WakaTimeStatCardProps {
	stats: WakaTimeStats | null;
}

/** WakaTime coding time, languages and editors. */
const WakaTimeStatCard: FC<WakaTimeStatCardProps> = ({
	stats,
}): ReactElement | null => {
	if (!stats) return null;

	return (
		<StatCard title="Coding activity" subtitle="WakaTime · last 7 days" live>
			<StatCardMetrics>
				<StatMetric value={stats.humanReadableTotal} label="This week" />
				<StatMetric
					value={stats.humanReadableDailyAverage}
					label="Daily average"
				/>
				{stats.bestDay && (
					<StatMetric
						value={stats.bestDay.text}
						label={`Best day · ${formatDate(stats.bestDay.date, 'short')}`}
					/>
				)}
			</StatCardMetrics>
			{stats.days.length > 0 && <ActivityChart days={stats.days} />}
			{stats.languages.length > 0 && (
				<>
					<StatCardDivider />
					<StatCardSection>Top languages</StatCardSection>
					<div className={styles.WakaTimeStatCard__languages}>
						{stats.languages.map((language, index) => (
							<MeterBar
								key={language.name}
								label={language.name}
								percent={language.percent}
								detail={language.text}
								delay={index * 0.05}
							/>
						))}
					</div>
				</>
			)}
		</StatCard>
	);
};

export default WakaTimeStatCard;
