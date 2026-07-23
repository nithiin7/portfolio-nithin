import type { FC, ReactElement } from 'react';

import styles from './SkipLink.module.scss';

interface SkipLinkProps {
	targetId: string;
}

const SkipLink: FC<SkipLinkProps> = ({ targetId }): ReactElement => (
	<a href={`#${targetId}`} className={styles.SkipLink}>
		Skip to content
	</a>
);

export default SkipLink;
