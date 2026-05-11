import styles from './loading.module.scss';

export default function PortfolioDetailsLoading(): React.ReactElement {
	return (
		<div className={styles.PortfolioDetailsLoading}>
			<div className={styles.PortfolioDetailsLoading__header}>
				<div className={styles.PortfolioDetailsLoading__back} />
				<div className={styles.PortfolioDetailsLoading__project_number} />
			</div>
			<div className={styles.PortfolioDetailsLoading__content}>
				<div className={styles.PortfolioDetailsLoading__main}>
					<div className={styles.PortfolioDetailsLoading__project_header}>
						<div className={styles.PortfolioDetailsLoading__title} />
						<div className={styles.PortfolioDetailsLoading__year} />
					</div>
					<div className={styles.PortfolioDetailsLoading__image} />
					<div className={styles.PortfolioDetailsLoading__description}>
						<div className={styles.PortfolioDetailsLoading__description_line} />
						<div className={styles.PortfolioDetailsLoading__description_line} />
						<div
							className={styles.PortfolioDetailsLoading__description_line_short}
						/>
					</div>
					<div className={styles.PortfolioDetailsLoading__links}>
						<div className={styles.PortfolioDetailsLoading__link} />
						<div className={styles.PortfolioDetailsLoading__link} />
					</div>
				</div>
				<div className={styles.PortfolioDetailsLoading__sidebar}>
					<div className={styles.PortfolioDetailsLoading__section}>
						<div className={styles.PortfolioDetailsLoading__section_title} />
						<div className={styles.PortfolioDetailsLoading__tags}>
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className={styles.PortfolioDetailsLoading__tag} />
							))}
						</div>
					</div>
					<div className={styles.PortfolioDetailsLoading__section}>
						<div className={styles.PortfolioDetailsLoading__section_title} />
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className={
									i % 3 === 2
										? styles.PortfolioDetailsLoading__feature_line_short
										: styles.PortfolioDetailsLoading__feature_line
								}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
