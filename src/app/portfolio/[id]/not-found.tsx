import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

import styles from './not-found.module.scss';

export default function NotFound() {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.icon}>404</div>
				<h1 className={styles.title}>Project Not Found</h1>
				<p className={styles.description}>
					The project you're looking for doesn't exist or has been moved.
				</p>
				<Link href="/" className={styles.backButton}>
					<FiArrowLeft size={20} />
					<span>Back to Portfolio</span>
				</Link>
			</div>
		</div>
	);
}
