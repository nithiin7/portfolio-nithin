'use client';
import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';

import styles from './Footer.module.scss';

interface FooterFrameProps {
	extended: ReactNode;
	children: ReactNode;
}

const FooterFrame = ({
	extended,
	children,
}: FooterFrameProps): ReactElement => {
	const full = usePathname() !== '/contact';

	return (
		<footer className={styles.Footer} data-variant={full ? 'full' : 'compact'}>
			{full && extended}
			{children}
		</footer>
	);
};

export default FooterFrame;
