'use client';
import { gsap } from 'gsap';
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

/**
 * Tracks the pointer within `boundsRef` and nudges `magneticRef` toward it via GSAP,
 * snapping back on leave. Two refs so the hit area (bounds) can be larger than the
 * element that actually visually moves (magnetic).
 */
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

		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;
		if (prefersReducedMotion) return;

		const handleMouseEnter = () => {
			gsap.to(magnetic, { duration: 0.3, scale, ease: 'power2.out' });
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
			const rect = bounds.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;

			gsap.to(magnetic, {
				duration: 0.3,
				x: x * strength,
				y: y * strength,
				ease: 'power2.out',
			});
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
