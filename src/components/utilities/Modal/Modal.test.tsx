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

		fireEvent.click(screen.getByRole('button', { name: /close modal/i }));

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
