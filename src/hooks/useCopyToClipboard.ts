import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const RESET_AFTER = 2000;

interface CopyMessages {
	success: string;
	failure: string;
}

/** Copies text with a toast; the flag resets after two seconds. */
export const useCopyToClipboard = ({
	success,
	failure,
}: CopyMessages): [boolean, (text: string) => Promise<void>] => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = window.setTimeout(() => setCopied(false), RESET_AFTER);
		return () => window.clearTimeout(timer);
	}, [copied]);

	const copy = useCallback(
		async (text: string) => {
			try {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				toast(success);
			} catch {
				toast.error(failure);
			}
		},
		[success, failure]
	);

	return [copied, copy];
};
