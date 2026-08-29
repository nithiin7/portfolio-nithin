'use client';
import type { ReactElement, ReactNode } from 'react';

import { useMagneticHover } from 'hooks/useMagneticHover';

import styles from './MagneticButton.module.scss';

interface MagneticButtonProps {
	children: ReactNode;
	href: string;
	title: string;
	className?: string;
}

/**
 * MagneticButton component that creates a magnetic hover effect using GSAP.
 * The button follows the mouse cursor when hovered, creating an engaging interaction.
 *
 * @component
 * @param {ReactNode} children - The content to render inside the button
 * @param {string} href - The link URL
 * @param {string} title - The button title for accessibility
 * @param {string} className - Optional additional CSS classes
 * @returns {JSX.Element} The rendered MagneticButton component
 */
const MagneticButton = ({
	children,
	href,
	title,
	className = '',
}: MagneticButtonProps): ReactElement => {
	const { boundsRef, magneticRef } = useMagneticHover<
		HTMLAnchorElement,
		HTMLDivElement
	>({ strength: 0.6, scale: 1.1 });

	return (
		<a
			ref={boundsRef}
			href={href}
			title={title}
			aria-label={title}
			className={`${styles.MagneticButton} ${className}`}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div
				ref={magneticRef}
				aria-hidden="true"
				className={styles.MagneticButton__content}
			>
				{children}
			</div>
		</a>
	);
};

export default MagneticButton;
