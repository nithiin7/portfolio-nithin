'use client';
import type { FC, ReactElement } from 'react';

import { useCopyToClipboard } from 'hooks/useCopyToClipboard';

import styles from './CodeBlock.module.scss';

interface CodeBlockProps {
	code: string;
}

const CodeBlock: FC<CodeBlockProps> = ({ code }): ReactElement => {
	const [copied, copy] = useCopyToClipboard({
		success: 'Code copied',
		failure: 'Couldn’t copy. Select the code by hand',
	});
	const lines = code.split('\n').length;

	return (
		<figure className={styles.CodeBlock}>
			<figcaption className={styles.CodeBlock__bar}>
				<span>
					Code{' '}
					<span className={styles.CodeBlock__lines}>
						· {lines} {lines === 1 ? 'line' : 'lines'}
					</span>
				</span>
				<button
					type="button"
					className={styles.CodeBlock__copy}
					onClick={() => void copy(code)}
					data-copied={copied}
				>
					{copied ? 'Copied' : 'Copy'}
				</button>
			</figcaption>
			{/* Focusable so keyboard users can scroll long lines horizontally */}
			{/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
			<pre className={styles.CodeBlock__pre} tabIndex={0}>
				<code>{code}</code>
			</pre>
		</figure>
	);
};

export default CodeBlock;
