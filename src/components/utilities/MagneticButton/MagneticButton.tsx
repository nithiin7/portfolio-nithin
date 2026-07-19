'use client';
import { gsap } from 'gsap';
import { useRef, useEffect, type ReactElement, type ReactNode } from 'react';

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
	const buttonRef = useRef<HTMLAnchorElement>(null);
	const magneticRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const button = buttonRef.current;
		const magnetic = magneticRef.current;

		if (!button || !magnetic) return;

		const handleMouseEnter = () => {
			gsap.to(magnetic, {
				duration: 0.3,
				scale: 1.1,
				ease: 'power2.out',
			});
		};

		const handleMouseLeave = () => {
			gsap.to(magnetic, {
				duration: 0.3,
				scale: 1,
				x: 0,
				y: 0,
				ease: 'power2.out',
			});
		};

		const handleMouseMove = (e: MouseEvent) => {
			const rect = button.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;

			gsap.to(magnetic, {
				duration: 0.3,
				x: x * 0.6,
				y: y * 0.6,
				ease: 'power2.out',
			});
		};

		button.addEventListener('mouseenter', handleMouseEnter);
		button.addEventListener('mouseleave', handleMouseLeave);
		button.addEventListener('mousemove', handleMouseMove);

		return () => {
			button.removeEventListener('mouseenter', handleMouseEnter);
			button.removeEventListener('mouseleave', handleMouseLeave);
			button.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<a
			ref={buttonRef}
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
