import { useEffect, useRef } from 'react';

interface UseKeyboardNavigationOptions {
	onEscape?: () => void;
	onEnter?: () => void;
	onSpace?: () => void;
	onArrowUp?: () => void;
	onArrowDown?: () => void;
	onArrowLeft?: () => void;
	onArrowRight?: () => void;
	onTab?: () => void;
	enabled?: boolean;
}

export function useKeyboardNavigation({
	onEscape,
	onEnter,
	onSpace,
	onArrowUp,
	onArrowDown,
	onArrowLeft,
	onArrowRight,
	onTab,
	enabled = true,
}: UseKeyboardNavigationOptions = {}) {
	const elementRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!enabled) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			const { key, target } = event;

			// Only handle events if the target is within our element
			if (elementRef.current && !elementRef.current.contains(target as Node)) {
				return;
			}

			switch (key) {
				case 'Escape':
					if (onEscape) {
						event.preventDefault();
						onEscape();
					}
					break;
				case 'Enter':
					if (onEnter) {
						event.preventDefault();
						onEnter();
					}
					break;
				case ' ':
					if (onSpace) {
						event.preventDefault();
						onSpace();
					}
					break;
				case 'ArrowUp':
					if (onArrowUp) {
						event.preventDefault();
						onArrowUp();
					}
					break;
				case 'ArrowDown':
					if (onArrowDown) {
						event.preventDefault();
						onArrowDown();
					}
					break;
				case 'ArrowLeft':
					if (onArrowLeft) {
						event.preventDefault();
						onArrowLeft();
					}
					break;
				case 'ArrowRight':
					if (onArrowRight) {
						event.preventDefault();
						onArrowRight();
					}
					break;
				case 'Tab':
					if (onTab) {
						onTab();
					}
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [
		enabled,
		onEscape,
		onEnter,
		onSpace,
		onArrowUp,
		onArrowDown,
		onArrowLeft,
		onArrowRight,
		onTab,
	]);

	return elementRef;
}

export function useFocusTrap(enabled = true) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!enabled) return;

		const container = containerRef.current;
		if (!container) return;

		const focusableElements = container.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		const firstElement = focusableElements[0] as HTMLElement;
		const lastElement = focusableElements[
			focusableElements.length - 1
		] as HTMLElement;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Tab') return;

			if (event.shiftKey) {
				if (document.activeElement === firstElement) {
					event.preventDefault();
					lastElement.focus();
				}
			} else {
				if (document.activeElement === lastElement) {
					event.preventDefault();
					firstElement.focus();
				}
			}
		};

		container.addEventListener('keydown', handleKeyDown);

		return () => {
			container.removeEventListener('keydown', handleKeyDown);
		};
	}, [enabled]);

	return containerRef;
}
