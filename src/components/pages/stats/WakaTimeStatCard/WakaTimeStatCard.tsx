import type { FC, ReactElement } from 'react';
import { SiWakatime } from 'react-icons/si';

import {
	ActivityChart,
	MeterBar,
	StatCard,
	StatCardDivider,
	StatCardSection,
	StatMetric,
} from 'components/pages';
import { formatDate } from 'helpers';
import type { WakaTimeStats } from 'types/wakatime';

import styles from './WakaTimeStatCard.module.scss';

interface WakaTimeStatCardProps {
	stats: WakaTimeStats | null;
}

const WakaTimeStatCard: FC<WakaTimeStatCardProps> = ({
	stats,
}): ReactElement | null => {
	if (!stats) return null;

	return (
		<StatCard
			icon={<SiWakatime />}
			title="Coding activity"
			subtitle="WakaTime · last 7 days"
			live
		>
			<div className={styles.WakaTimeStatCard__metrics}>
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
			</div>
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
