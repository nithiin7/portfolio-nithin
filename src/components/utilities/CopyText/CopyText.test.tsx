import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CopyText from './CopyText';

vi.mock('sonner', () => ({
	toast: Object.assign(vi.fn(), { error: vi.fn() }),
}));

const stubClipboard = (writeText: (text: string) => Promise<void>) =>
	Object.defineProperty(navigator, 'clipboard', {
		value: { writeText: vi.fn(writeText) },
		configurable: true,
	});

describe('CopyText', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('copies the address and confirms with a toast', async () => {
		stubClipboard(() => Promise.resolve());
		render(<CopyText text="hi@example.com" label="Email" />);

		fireEvent.click(screen.getByRole('button', { name: /hi@example.com/ }));

		await waitFor(() => expect(screen.getByText('Copied')).toBeInTheDocument());
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			'hi@example.com'
		);
		expect(toast).toHaveBeenCalledWith('Email copied', {
			description: 'hi@example.com',
		});
	});

	it('reports a failed copy instead of claiming success', async () => {
		stubClipboard(() => Promise.reject(new Error('denied')));
		render(<CopyText text="hi@example.com" label="Email" />);

		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => expect(toast.error).toHaveBeenCalled());
		expect(toast).not.toHaveBeenCalled();
		expect(screen.getByText('Copy')).toBeInTheDocument();
	});
});
