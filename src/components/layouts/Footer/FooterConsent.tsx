'use client';
import type { ReactElement } from 'react';

import { useConsent } from 'contexts/ConsentContext';

import styles from './Footer.module.scss';

/** Footer button that reopens the cookie settings. */
const FooterConsent = (): ReactElement => {
	const { openSettings } = useConsent();

	return (
		<button
			type="button"
			className={styles.Footer__top}
			onClick={(event) => openSettings(event.currentTarget)}
		>
			<span className={styles.Footer__underline}>Cookie settings</span>
		</button>
	);
};

export default FooterConsent;
