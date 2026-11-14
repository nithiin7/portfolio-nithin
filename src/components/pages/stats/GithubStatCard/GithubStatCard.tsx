import type { FC, ReactElement } from 'react';

import CountUp from 'components/pages/stats/CountUp/CountUp';
import MeterBar from 'components/pages/stats/MeterBar/MeterBar';
import StatCard, {
	StatCardDivider,
	StatCardMetrics,
	StatCardSection,
} from 'components/pages/stats/StatCard/StatCard';
import StatMetric from 'components/pages/stats/StatMetric/StatMetric';
import { GITHUB_USERNAME } from 'constants/index';
import { formatDate } from 'helpers/format';
import type { GithubStats } from 'types/github';

import styles from './GithubStatCard.module.scss';

interface GithubStatCardProps {
	stats: GithubStats | null;
}

/** GitHub repos, stars and languages. */
const GithubStatCard: FC<GithubStatCardProps> = ({
	stats,
}): ReactElement | null => {
	if (!stats) return null;

	const maxLanguageCount = stats.topLanguages[0]?.count ?? 1;

	return (
		<StatCard
			title="GitHub"
			subtitle={`@${GITHUB_USERNAME}`}
			href={`https://github.com/${GITHUB_USERNAME}`}
			linkLabel="Profile"
			live
		>
			<StatCardMetrics>
				<StatMetric
					value={<CountUp value={stats.repoCount} />}
					label="Repositories"
				/>
				<StatMetric
					value={<CountUp value={stats.totalStars} />}
					label="Stars"
				/>
				{stats.followers !== null && (
					<StatMetric
						value={<CountUp value={stats.followers} />}
						label="Followers"
					/>
				)}
			</StatCardMetrics>
			{stats.topLanguages.length > 0 && (
				<>
					<StatCardDivider />
					<StatCardSection>Most used languages</StatCardSection>
					<div className={styles.GithubStatCard__languages}>
						{stats.topLanguages.map((language, index) => (
							<MeterBar
								key={language.name}
								label={language.name}
								percent={(language.count / maxLanguageCount) * 100}
								detail={`${language.count} ${language.count === 1 ? 'repo' : 'repos'}`}
								delay={index * 0.05}
							/>
						))}
					</div>
				</>
			)}
			{stats.recentRepos.length > 0 && (
				<>
					<StatCardDivider />
					<StatCardSection>Recently pushed</StatCardSection>
					<ul className={styles.GithubStatCard__repos}>
						{stats.recentRepos.map((repo) => (
							<li key={repo.name}>
								<a
									href={repo.url}
									target="_blank"
									rel="noopener noreferrer"
									title={repo.name}
								>
									{repo.name}
								</a>
								<span>
									{repo.language && `${repo.language} · `}
									{formatDate(repo.pushedAt, 'relative')}
								</span>
							</li>
						))}
					</ul>
				</>
			)}
		</StatCard>
	);
};

export default GithubStatCard;
