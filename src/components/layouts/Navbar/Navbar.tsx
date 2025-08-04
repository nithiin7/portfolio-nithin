'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import type { FC } from 'react';

import Logo from 'assets/logos/logo.svg';
import { useScrollDirection } from 'hooks/useScrollDirection';

import styles from './Navbar.module.scss';

/**
 * BlogNavbar component with logo, navigation links, and contact CTA
 */
const Navbar: FC = () => {
	const { isVisible } = useScrollDirection();

	return (
		<motion.nav
			className={styles.Navbar}
			initial={{ opacity: 0, y: -20 }}
			animate={{
				opacity: isVisible ? 1 : 0,
				y: isVisible ? 0 : -100,
			}}
			transition={{
				duration: 0.5,
				ease: [0.33, 1, 0.68, 1],
			}}
		>
			<div className={styles.Navbar__container}>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
				>
					<motion.div
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
					>
						<Link href="/" className={styles.Navbar__logo}>
							<Logo />
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</motion.nav>
	);
};

export default Navbar;
