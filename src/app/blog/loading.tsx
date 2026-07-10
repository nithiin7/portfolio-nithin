import styles from './loading.module.scss';

export default function BlogLoading(): React.ReactElement {
	const skeletonCards = Array.from({ length: 6 });

	return (
		<div className={styles.BlogLoading}>
			<div className={styles.BlogLoading__container}>
				<div className={styles.BlogLoading__backButton} />
				<div className={styles.BlogLoading__header}>
					<div className={styles.BlogLoading__title} />
					<div className={styles.BlogLoading__subtitle} />
					<div className={styles.BlogLoading__cta} />
				</div>
				<div className={styles.BlogLoading__search} />
				<div className={styles.BlogLoading__content}>
					<div className={styles.BlogLoading__grid}>
						{skeletonCards.map((_, i) => (
							<div key={i} className={styles.BlogLoading__card}>
								<div className={styles.BlogLoading__card_image} />
								<div className={styles.BlogLoading__card_content}>
									<div className={styles.BlogLoading__card_meta} />
									<div className={styles.BlogLoading__card_title} />
									<div className={styles.BlogLoading__card_title_second} />
									<div className={styles.BlogLoading__card_excerpt} />
									<div className={styles.BlogLoading__card_excerpt_second} />
									<div className={styles.BlogLoading__card_excerpt_third} />
									<div className={styles.BlogLoading__card_footer}>
										<div className={styles.BlogLoading__card_tags}>
											<div className={styles.BlogLoading__card_tag} />
											<div className={styles.BlogLoading__card_tag} />
										</div>
										<div className={styles.BlogLoading__card_arrow} />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
