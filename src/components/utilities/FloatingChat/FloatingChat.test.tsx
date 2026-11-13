import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import { beforeAll, describe, expect, it } from 'vitest';

import FloatingChat from './FloatingChat';

const URL = 'https://chat.example.hf.space';

beforeAll(() => {
	MotionGlobalConfig.skipAnimations = true;
});

const launcher = () =>
	screen.getByRole('button', { name: /chat with nithin’s ai assistant/i });

describe('FloatingChat', () => {
	it('starts closed with no iframe loaded', () => {
		render(<FloatingChat chatbotUrl={URL} />);

		expect(launcher()).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(document.querySelector('iframe')).toBeNull();
	});

	it('opens the panel, mounts the iframe and moves focus to close', () => {
		render(<FloatingChat chatbotUrl={URL} />);

		fireEvent.click(launcher());

		const dialog = screen.getByRole('dialog', { name: 'Chat with Nithin' });
		const launcherButton = document.querySelector(
			'[aria-controls]'
		) as HTMLElement;
		expect(launcherButton).toHaveAttribute('aria-expanded', 'true');
		expect(launcherButton).toHaveAttribute('aria-controls', dialog.id);
		expect(dialog.querySelector('iframe')).toHaveAttribute('src', URL);
		expect(screen.getByRole('status')).toHaveTextContent('Loading assistant');
		expect(document.activeElement).toBe(
			screen.getAllByRole('button', { name: 'Close chat' }).at(-1)
		);
	});

	it('hides the loading note once the iframe loads', () => {
		render(<FloatingChat chatbotUrl={URL} />);
		fireEvent.click(launcher());

		fireEvent.load(document.querySelector('iframe') as HTMLIFrameElement);

		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});

	it('closes on Escape and returns focus to the launcher', async () => {
		render(<FloatingChat chatbotUrl={URL} />);
		fireEvent.click(launcher());

		fireEvent.keyDown(window, { key: 'Escape' });

		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		);
		expect(launcher()).toHaveAttribute('aria-expanded', 'false');
		expect(document.activeElement).toBe(launcher());
	});

	it('closes from the panel’s close button', async () => {
		render(<FloatingChat chatbotUrl={URL} />);
		fireEvent.click(launcher());

		const buttons = screen.getAllByRole('button', { name: 'Close chat' });
		fireEvent.click(buttons.at(-1) as HTMLElement);

		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		);
	});
});
