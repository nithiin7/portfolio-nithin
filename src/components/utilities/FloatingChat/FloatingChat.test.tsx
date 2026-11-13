import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

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

	describe('at the bottom of the page', () => {
		const scrollTo = (scrollY: number) => {
			Object.defineProperty(document.documentElement, 'scrollHeight', {
				configurable: true,
				value: 3000,
			});
			Object.defineProperty(window, 'innerHeight', {
				configurable: true,
				value: 800,
			});
			Object.defineProperty(window, 'scrollY', {
				configurable: true,
				value: scrollY,
			});
			act(() => {
				window.dispatchEvent(new Event('scroll'));
			});
		};
		const wrapper = () => launcher().parentElement as HTMLElement;

		afterEach(() => scrollTo(0));

		it('hides the launcher near the end and shows it again above', () => {
			render(<FloatingChat chatbotUrl={URL} />);
			scrollTo(0);
			expect(wrapper().className).not.toMatch(/--hidden/);

			scrollTo(2200);
			expect(wrapper().className).toMatch(/--hidden/);

			scrollTo(1500);
			expect(wrapper().className).not.toMatch(/--hidden/);
		});

		it('keeps the launcher while the chat is open', () => {
			render(<FloatingChat chatbotUrl={URL} />);
			fireEvent.click(launcher());

			scrollTo(2200);

			expect(
				screen.getAllByRole('button', { name: 'Close chat' })[0]?.parentElement
					?.className
			).not.toMatch(/--hidden/);
		});
	});
});
