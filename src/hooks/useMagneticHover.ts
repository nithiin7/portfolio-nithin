'use client';
import { animate } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface UseMagneticHoverOptions {
	strength?: number;
	scale?: number;
}

interface UseMagneticHoverResult<
	Bounds extends HTMLElement,
	Magnetic extends HTMLElement,
> {
	boundsRef: RefObject<Bounds | null>;
	magneticRef: RefObject<Magnetic | null>;
}

/** Pulls an element toward the pointer while it hovers the bounds. */
export const useMagneticHover = <
	Bounds extends HTMLElement = HTMLElement,
	Magnetic extends HTMLElement = HTMLElement,
>(
	options: UseMagneticHoverOptions = {}
): UseMagneticHoverResult<Bounds, Magnetic> => {
	const { strength = 0.6, scale = 1.1 } = options;
	const boundsRef = useRef<Bounds>(null);
	const magneticRef = useRef<Magnetic>(null);

	useEffect(() => {
		const bounds = boundsRef.current;
		const magnetic = magneticRef.current;
		if (!bounds || !magnetic) return;

		const skip = window.matchMedia(
			'(prefers-reduced-motion: reduce), (hover: none)'
		).matches;
		if (skip) return;

		const transition = { duration: 0.3, ease: 'easeOut' } as const;

		const handleMouseEnter = () => {
			animate(magnetic, { scale }, transition);
		};

		const handleMouseLeave = () => {
			animate(magnetic, { scale: 1, x: 0, y: 0 }, transition);
		};

		const handleMouseMove = (e: MouseEvent) => {
			const rect = bounds.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;

			animate(magnetic, { x: x * strength, y: y * strength }, transition);
		};

		bounds.addEventListener('mouseenter', handleMouseEnter);
		bounds.addEventListener('mouseleave', handleMouseLeave);
		bounds.addEventListener('mousemove', handleMouseMove);

		return () => {
			bounds.removeEventListener('mouseenter', handleMouseEnter);
			bounds.removeEventListener('mouseleave', handleMouseLeave);
			bounds.removeEventListener('mousemove', handleMouseMove);
		};
	}, [strength, scale]);

	return { boundsRef, magneticRef };
};
