'use client';
import type { FC, ReactElement } from 'react';

import type { ShareLink } from 'helpers/social';
import { useCopyToClipboard } from 'hooks/useCopyToClipboard';

import styles from './PostShare.module.scss';

interface PostShareProps {
	url: string;
	links: ShareLink[];
}

/** Share links and a copy-link button for a post. */
const PostShare: FC<PostShareProps> = ({ url, links }): ReactElement => {
	const [copied, copy] = useCopyToClipboard({
		success: 'Link copied',
		failure: 'Couldn’t copy the link',
	});

	return (
		<ul className={styles.PostShare} aria-label="Share this article">
			{links.map((link) => (
				<li key={link.label}>
					<a
						href={link.href}
						className={styles.PostShare__link}
						target="_blank"
						rel="noopener noreferrer"
					>
						{link.label}
						<span className={styles.PostShare__sr}>
							{' '}
							(share, opens in a new tab)
						</span>
					</a>
				</li>
			))}
			<li>
				<button
					type="button"
					className={styles.PostShare__link}
					data-copied={copied}
					onClick={() => void copy(url)}
				>
					{copied ? 'Copied' : 'Copy link'}
				</button>
			</li>
		</ul>
	);
};

export default PostShare;
