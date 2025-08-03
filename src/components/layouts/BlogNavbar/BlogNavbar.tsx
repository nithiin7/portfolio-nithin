'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import type { FC } from 'react';

import Logo from 'assets/logos/logo.svg';

import styles from './BlogNavbar.module.scss';

/**
 * BlogNavbar component with logo, navigation links, and contact CTA
 */
const BlogNavbar: FC = () => {
	return (
		<motion.nav
			className={styles.BlogNavbar}
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
		>
			<div className={styles.BlogNavbar__container}>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
				>
					<Link href="/" className={styles.BlogNavbar__logo}>
						<Logo />
					</Link>
				</motion.div>
			</div>
		</motion.nav>
	);
};

export default BlogNavbar;
