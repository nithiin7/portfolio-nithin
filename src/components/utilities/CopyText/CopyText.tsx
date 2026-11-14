'use client';
import { useEffect, useState, type ReactElement } from 'react';

import styles from './CopyText.module.scss';

export interface CopyTextProps {
	text: string;
	/** Names what was copied in the toast, e.g. "Email" → "Email copied". */
	label: string;
	className?: string;
}

const RESET_AFTER = 2400;

/**
 * The text itself is the button: clicking copies it and confirms with a
 * toast. A failed copy (no clipboard permission, insecure context) says so
 * rather than pretending, and keeps the address on screen to copy by hand.
 */
const CopyText = ({ text, label, className }: CopyTextProps): ReactElement => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = window.setTimeout(() => setCopied(false), RESET_AFTER);
		return () => window.clearTimeout(timer);
	}, [copied]);

	const copy = async (): Promise<void> => {
		// sonner is only needed once someone copies; keep it out of every page's bundle
		const { toast } = await import('sonner');
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			toast(`${label} copied`, { description: text });
		} catch {
			toast.error('Couldn’t copy the address', {
				description: `Select it by hand: ${text}`,
			});
		}
	};

	return (
		<button
			type="button"
			className={[styles.CopyText, className].filter(Boolean).join(' ')}
			data-copied={copied}
			onClick={copy}
		>
			<span className={styles.CopyText__address}>{text}</span>
			<span className={styles.CopyText__hint}>
				<span key={String(copied)}>{copied ? 'Copied' : 'Copy'}</span>
			</span>
		</button>
	);
};

export default CopyText;
