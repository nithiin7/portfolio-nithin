import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import styles from './Cursor.module.scss';

interface CursorProps {
	className?: string;
	variant?: string;
	isHovered?: boolean;
}

const Cursor: React.FC<CursorProps> = ({
	className = '',
	variant = '',
	isHovered = false,
}) => {
	const mouse = useRef({ x: 0, y: 0 });
	const circle = useRef<HTMLDivElement>(null);

	const size = isHovered ? 300 : 30;

	const delayedMouse = useRef({ x: 0, y: 0 });

	const manageMouseMove = (e: MouseEvent) => {
		const { clientX, clientY } = e;

		mouse.current = {
			x: clientX,
			y: clientY,
		};

		moveCircle(mouse.current.x, mouse.current.y);
	};

	const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

	const moveCircle = (x: number, y: number) => {
		if (circle.current) {
			gsap.set(circle.current, { x, y, xPercent: -50, yPercent: -50 });
		}
	};

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
			className={`${styles.Cursor} ${styles[`Cursor__${variant}`]} ${className}`}
		>
			<div
				ref={circle}
				style={{
					backgroundColor: '#fff',
					width: size,
					height: size,
					transition: 'height 0.3s ease-out, width 0.3s ease-out',
				}}
				className="Cursor__rounded"
			/>
		</div>
	);
};

export default Cursor;
