'use client';
import { useEffect, useState, type ReactElement } from 'react';
import { toast } from 'sonner';

import styles from './CopyEmail.module.scss';

export interface CopyEmailProps {
	email: string;
	className?: string;
}

const RESET_AFTER = 2400;

/**
 * The address itself is the button: clicking copies it and confirms with a
 * toast. A failed copy (no clipboard permission, insecure context) says so
 * rather than pretending, and keeps the address on screen to copy by hand.
 */
const CopyEmail = ({ email, className }: CopyEmailProps): ReactElement => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = window.setTimeout(() => setCopied(false), RESET_AFTER);
		return () => window.clearTimeout(timer);
	}, [copied]);

	const copy = async (): Promise<void> => {
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			toast('Email copied', { description: email });
		} catch {
			toast.error('Couldn’t copy the address', {
				description: `Select it by hand: ${email}`,
			});
		}
	};

	return (
		<button
			type="button"
			className={[styles.CopyEmail, className].filter(Boolean).join(' ')}
			data-copied={copied}
			onClick={copy}
		>
			<span className={styles.CopyEmail__address}>{email}</span>
			<span className={styles.CopyEmail__hint}>
				<span key={String(copied)}>{copied ? 'Copied' : 'Copy'}</span>
			</span>
		</button>
	);
};

export default CopyEmail;
