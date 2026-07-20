'use client';
import gsap from 'gsap';
import type { FC } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import styles from './Cursor.module.scss';

interface CursorProps {
	className?: string;
	variant?: string;
	isHovered?: boolean;
}

/**
 * A custom cursor component that follows the mouse movement and can change size based on hover state.
 * @param {CursorProps} props - The props for the component.
 * @returns {JSX.Element} The rendered cursor component.
 */
const Cursor: FC<CursorProps> = ({
	className = '',
	variant = '',
	isHovered = false,
}) => {
	const mouse = useRef({ x: 0, y: 0 });
	const circle = useRef<HTMLDivElement>(null);

	const size = isHovered ? 300 : 30;

	const delayedMouse = useRef({ x: 0, y: 0 });
	const animationIdRef = useRef<number | null>(null);

	/**
	 * Performs linear interpolation between two values.
	 *
	 * @param {number} x - The starting value.
	 * @param {number} y - The target value.
	 * @param {number} a - The interpolation factor (between 0 and 1).
	 * @returns {number} The interpolated value.
	 */
	const lerp = useCallback(
		(x: number, y: number, a: number): number => x * (1 - a) + y * a,
		[]
	);

	/**
	 * Moves the custom cursor to a specified position.
	 *
	 * @param {number} x - The x-coordinate to move the cursor to.
	 * @param {number} y - The y-coordinate to move the cursor to.
	 */
	const moveCircle = useCallback(
		(x: number, y: number) => {
			if (circle.current) {
				gsap.set(circle.current, { x, y, xPercent: -50, yPercent: -50 });
			}
		},
		[circle]
	);

	/**
	 * Animates the cursor by updating its position using a smooth interpolation.
	 * This function is recursively called using requestAnimationFrame to create
	 * a smooth animation effect.
	 *
	 * Stops rescheduling once the cursor has caught up to the mouse — mirrors
	 * ClickSpark's pattern of only looping while there's work to do — and
	 * manageMouseMove restarts it on the next move.
	 */
	const animate = useCallback(() => {
		const { x, y } = delayedMouse.current;
		const nextX = lerp(x, mouse.current.x, 0.075);
		const nextY = lerp(y, mouse.current.y, 0.075);
		delayedMouse.current = { x: nextX, y: nextY };
		moveCircle(nextX, nextY);

		const hasConverged =
			Math.abs(mouse.current.x - nextX) < 0.1 &&
			Math.abs(mouse.current.y - nextY) < 0.1;

		animationIdRef.current = hasConverged
			? null
			: window.requestAnimationFrame(animate);
	}, [lerp, moveCircle]);

	/**
	 * Handles mouse movement events to update the mouse position
	 * and resume the animation loop if it had paused at idle.
	 *
	 * @param {MouseEvent} e - The mouse event containing the current mouse position.
	 */
	const manageMouseMove = useCallback(
		(e: MouseEvent) => {
			const { clientX, clientY } = e;

			mouse.current = {
				x: clientX,
				y: clientY,
			};

			if (animationIdRef.current === null) {
				animationIdRef.current = window.requestAnimationFrame(animate);
			}
		},
		[animate]
	);

	useEffect(() => {
		animationIdRef.current = window.requestAnimationFrame(animate);
		window.addEventListener('mousemove', manageMouseMove);

		return () => {
			window.removeEventListener('mousemove', manageMouseMove);
			if (animationIdRef.current !== null) {
				window.cancelAnimationFrame(animationIdRef.current);
			}
		};
	}, [animate, manageMouseMove]);

	return (
		<div
			className={[styles.Cursor, styles[`Cursor__${variant}`], className].join(
				' '
			)}
		>
			<div
				ref={circle}
				style={{
					backgroundColor: '#fff',
					width: size,
					height: size,
					transition: 'height 0.3s ease-out, width 0.3s ease-out',
				}}
				className={styles.Cursor__rounded}
			/>
		</div>
	);
};

export default Cursor;
