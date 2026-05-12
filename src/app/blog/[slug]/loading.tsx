import styles from './loading.module.scss';

export default function BlogDetailLoading(): React.ReactElement {
	return (
		<div className={styles.BlogDetailLoading}>
			<div className={styles.BlogDetailLoading__container}>
				<div className={styles.BlogDetailLoading__breadcrumb} />
				<div className={styles.BlogDetailLoading__hero} />
				<div className={styles.BlogDetailLoading__content_wrapper}>
					<div className={styles.BlogDetailLoading__content}>
						<div className={styles.BlogDetailLoading__content_heading} />
						<div className={styles.BlogDetailLoading__content_line} />
						<div className={styles.BlogDetailLoading__content_line} />
						<div className={styles.BlogDetailLoading__content_line_short} />
						<div className={styles.BlogDetailLoading__content_line} />
						<div className={styles.BlogDetailLoading__content_line_mid} />
						<div className={styles.BlogDetailLoading__content_gap} />
						<div className={styles.BlogDetailLoading__content_subheading} />
						<div className={styles.BlogDetailLoading__content_line} />
						<div className={styles.BlogDetailLoading__content_line} />
						<div className={styles.BlogDetailLoading__content_line_short} />
						<div className={styles.BlogDetailLoading__content_gap} />
						<div className={styles.BlogDetailLoading__content_line} />
						<div className={styles.BlogDetailLoading__content_line} />
						<div className={styles.BlogDetailLoading__content_line_mid} />
					</div>
					<div className={styles.BlogDetailLoading__toc}>
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className={styles.BlogDetailLoading__toc_item} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
