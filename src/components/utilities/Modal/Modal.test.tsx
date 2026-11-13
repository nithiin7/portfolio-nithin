import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Modal from './Modal';

describe('Modal', () => {
	it('renders nothing when closed', () => {
		render(
			<Modal isOpen={false} onClose={vi.fn()} title="Hello">
				<p>Body</p>
			</Modal>
		);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('renders the title and children when open', () => {
		render(
			<Modal isOpen onClose={vi.fn()} title="Hello">
				<p>Body</p>
			</Modal>
		);

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByText('Hello')).toBeInTheDocument();
		expect(screen.getByText('Body')).toBeInTheDocument();
	});

	it('calls onClose when the close button is clicked', () => {
		const onClose = vi.fn();
		render(
			<Modal isOpen onClose={onClose} title="Hello">
				<p>Body</p>
			</Modal>
		);

		fireEvent.click(screen.getByRole('button', { name: /close dialog/i }));

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when the Escape key is pressed', () => {
		const onClose = vi.fn();
		render(
			<Modal isOpen onClose={onClose} title="Hello">
				<p>Body</p>
			</Modal>
		);

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when the backdrop is clicked directly', () => {
		const onClose = vi.fn();
		render(
			<Modal isOpen onClose={onClose} title="Hello">
				<p>Body</p>
			</Modal>
		);

		fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose when clicking inside the modal content', () => {
		const onClose = vi.fn();
		render(
			<Modal isOpen onClose={onClose} title="Hello">
				<p>Body</p>
			</Modal>
		);

		fireEvent.click(screen.getByText('Body'));

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('Modal focus', () => {
	const Harness = ({ isOpen }: { isOpen: boolean }) => (
		<>
			<button type="button">Opener</button>
			<Modal isOpen={isOpen} onClose={vi.fn()} title="Hello">
				<a href="#first">First</a>
				<a href="#last">Last</a>
			</Modal>
		</>
	);

	it('moves focus into the dialog and restores it on close', () => {
		const { rerender } = render(<Harness isOpen={false} />);
		const opener = screen.getByRole('button', { name: 'Opener' });
		opener.focus();

		rerender(<Harness isOpen />);
		expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(
			true
		);

		rerender(<Harness isOpen={false} />);
		expect(document.activeElement).toBe(opener);
	});

	it('wraps Tab from the last focusable back to the first', () => {
		render(<Harness isOpen />);
		const close = screen.getByRole('button', { name: /close dialog/i });
		const last = screen.getByRole('link', { name: 'Last' });

		last.focus();
		fireEvent.keyDown(last, { key: 'Tab' });
		expect(document.activeElement).toBe(close);

		close.focus();
		fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
		expect(document.activeElement).toBe(last);
	});
});
