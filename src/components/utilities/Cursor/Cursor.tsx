import { useEffect, useRef } from 'react';
import gsap from 'gsap';

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
const Cursor: React.FC<CursorProps> = ({
	className = '',
	variant = '',
	isHovered = false,
}) => {
	const mouse = useRef({ x: 0, y: 0 });
	const circle = useRef<HTMLDivElement>(null);

	const size = isHovered ? 300 : 30;

	const delayedMouse = useRef({ x: 0, y: 0 });

	/**
	 * Handles mouse movement events to update the mouse position
	 * and move the custom cursor accordingly.
	 *
	 * @param {MouseEvent} e - The mouse event containing the current mouse position.
	 */
	const manageMouseMove = (e: MouseEvent) => {
		const { clientX, clientY } = e;

		mouse.current = {
			x: clientX,
			y: clientY,
		};

		moveCircle(mouse.current.x, mouse.current.y);
	};

	/**
	 * Performs linear interpolation between two values.
	 *
	 * @param {number} x - The starting value.
	 * @param {number} y - The target value.
	 * @param {number} a - The interpolation factor (between 0 and 1).
	 * @returns {number} The interpolated value.
	 */
	const lerp = (x: number, y: number, a: number): number => x * (1 - a) + y * a;

	/**
	 * Moves the custom cursor to a specified position.
	 *
	 * @param {number} x - The x-coordinate to move the cursor to.
	 * @param {number} y - The y-coordinate to move the cursor to.
	 */
	const moveCircle = (x: number, y: number) => {
		if (circle.current) {
			gsap.set(circle.current, { x, y, xPercent: -50, yPercent: -50 });
		}
	};

	/**
	 * Animates the cursor by updating its position using a smooth interpolation.
	 * This function is recursively called using requestAnimationFrame to create
	 * a smooth animation effect.
	 */
	const animate = () => {
		const { x, y } = delayedMouse.current;
		delayedMouse.current = {
			x: lerp(x, mouse.current.x, 0.075),
			y: lerp(y, mouse.current.y, 0.075),
		};
		moveCircle(delayedMouse.current.x, delayedMouse.current.y);
		window.requestAnimationFrame(animate);
	};

	useEffect(() => {
		animate();
		window.addEventListener('mousemove', manageMouseMove);

		return () => {
			window.removeEventListener('mousemove', manageMouseMove);
		};
	}, []);

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
