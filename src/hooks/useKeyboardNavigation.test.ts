import { fireEvent, render } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useFocusTrap, useKeyboardNavigation } from './useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
	it('invokes the matching handler for each key and calls preventDefault', () => {
		const onEscape = vi.fn();
		const onArrowDown = vi.fn();

		function Harness() {
			useKeyboardNavigation({ onEscape, onArrowDown });
			return null;
		}

		render(createElement(Harness));

		const escapeEvent = new KeyboardEvent('keydown', {
			key: 'Escape',
			cancelable: true,
		});
		document.dispatchEvent(escapeEvent);
		expect(onEscape).toHaveBeenCalledTimes(1);
		expect(escapeEvent.defaultPrevented).toBe(true);

		fireEvent.keyDown(document, { key: 'ArrowDown' });
		expect(onArrowDown).toHaveBeenCalledTimes(1);
	});

	it('does nothing when disabled', () => {
		const onEscape = vi.fn();

		function Harness() {
			useKeyboardNavigation({ onEscape, enabled: false });
			return null;
		}

		render(createElement(Harness));

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(onEscape).not.toHaveBeenCalled();
	});
});

describe('useFocusTrap', () => {
	it('wraps focus from the last element back to the first on Tab', () => {
		function Harness() {
			const containerRef = useFocusTrap(true);
			return createElement(
				'div',
				{ ref: containerRef },
				createElement('button', { key: 'first' }, 'First'),
				createElement('button', { key: 'last' }, 'Last')
			);
		}

		const { getByText } = render(createElement(Harness));
		const first = getByText('First');
		const last = getByText('Last');

		last.focus();
		expect(document.activeElement).toBe(last);

		fireEvent.keyDown(last, { key: 'Tab' });

		expect(document.activeElement).toBe(first);
	});

	it('wraps focus from the first element back to the last on Shift+Tab', () => {
		function Harness() {
			const containerRef = useFocusTrap(true);
			return createElement(
				'div',
				{ ref: containerRef },
				createElement('button', { key: 'first' }, 'First'),
				createElement('button', { key: 'last' }, 'Last')
			);
		}

		const { getByText } = render(createElement(Harness));
		const first = getByText('First');
		const last = getByText('Last');

		first.focus();
		fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });

		expect(document.activeElement).toBe(last);
	});
});
