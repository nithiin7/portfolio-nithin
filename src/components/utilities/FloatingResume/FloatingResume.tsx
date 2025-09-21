'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useCallback, useState } from 'react';

import { DownloadIcon } from 'assets/icons';

import styles from './FloatingResume.module.scss';

interface FloatingResumeProps {
	resumeUrl: string;
}

const FloatingResume: React.FC<FloatingResumeProps> = ({ resumeUrl }) => {
	const [showTooltip, setShowTooltip] = useState(false);

	const handleDownload = useCallback(() => {
		const link = document.createElement('a');
		link.href = resumeUrl;
		link.download = 'Nithin_Resume.pdf';
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, [resumeUrl]);

	return (
		<div className={styles.container}>
			<motion.button
				className={styles.FloatingButton}
				onClick={handleDownload}
				onMouseEnter={() => setShowTooltip(true)}
				onMouseLeave={() => setShowTooltip(false)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.98 }}
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{
					duration: 0.2,
					ease: [0.4, 0, 0.2, 1],
					type: 'spring',
					stiffness: 300,
					damping: 25,
				}}
				aria-label="Download resume"
			>
				<motion.div
					className={styles.icon}
					whileHover={{ rotate: 5 }}
					transition={{
						duration: 0.15,
						ease: [0.4, 0, 0.2, 1],
					}}
				>
					<DownloadIcon width={24} height={24} />
				</motion.div>
			</motion.button>
			<AnimatePresence>
				{showTooltip && (
					<motion.div
						className={styles.tooltip}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						transition={{
							duration: 0.2,
							ease: [0.4, 0, 0.2, 1],
						}}
					>
						Download Resume
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default FloatingResume;
