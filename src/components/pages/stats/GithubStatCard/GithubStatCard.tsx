import type { FC, ReactElement } from 'react';
import { FaGithub } from 'react-icons/fa';

import {
	CountUp,
	MeterBar,
	StatCard,
	StatCardDivider,
	StatCardSection,
	StatMetric,
} from 'components/pages';
import { GITHUB_USERNAME } from 'constants/index';
import { formatDate } from 'helpers';
import type { GithubStats } from 'types/github';

import styles from './GithubStatCard.module.scss';

interface GithubStatCardProps {
	stats: GithubStats | null;
}

const GithubStatCard: FC<GithubStatCardProps> = ({
	stats,
}): ReactElement | null => {
	if (!stats) return null;

	const maxLanguageCount = stats.topLanguages[0]?.count ?? 1;

	return (
		<StatCard
			icon={<FaGithub />}
			title="GitHub"
			subtitle={`@${GITHUB_USERNAME}`}
			href={`https://github.com/${GITHUB_USERNAME}`}
			linkLabel="Open GitHub profile"
			live
		>
			<div className={styles.GithubStatCard__metrics}>
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
			</div>
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
