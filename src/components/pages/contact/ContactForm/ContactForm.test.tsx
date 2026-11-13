import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { withSite } from 'test/fixtures';

import ContactForm from './ContactForm';

const { sendForm, executeRecaptcha } = vi.hoisted(() => ({
	sendForm: vi.fn(),
	executeRecaptcha: vi.fn(),
}));

vi.mock('@emailjs/browser', () => ({ sendForm }));
vi.mock('react-google-recaptcha-v3', () => ({
	useGoogleReCaptcha: () => ({ executeRecaptcha }),
}));

const fill = async (name: string, email: string, message: string) => {
	const user = userEvent.setup();
	await user.type(screen.getByLabelText(/your name/i), name);
	await user.type(screen.getByLabelText(/your email/i), email);
	await user.type(screen.getByLabelText(/message/i), message);
	return user;
};

// Reduced motion collapses the form ⇄ success swap to zero duration.
const reducedMotion = (query: string): MediaQueryList =>
	({
		matches: query.includes('prefers-reduced-motion'),
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	}) as MediaQueryList;

describe('ContactForm', () => {
	beforeEach(() => {
		window.matchMedia = reducedMotion;
		sendForm.mockReset().mockResolvedValue({ status: 200 });
		executeRecaptcha.mockReset().mockResolvedValue('captcha-token');
	});

	it('validates a field inline once it loses focus', async () => {
		const user = userEvent.setup();
		render(withSite(<ContactForm />));
		const email = screen.getByLabelText(/your email/i);

		await user.type(email, 'not-an-email');
		await user.tab();

		expect(await screen.findByText('Invalid email')).toBeInTheDocument();
		expect(email).toHaveAttribute('aria-invalid', 'true');
		expect(email).toHaveAccessibleDescription('Invalid email');

		await user.clear(email);
		await user.type(email, 'jane@example.com');

		await waitFor(() =>
			expect(screen.queryByText('Invalid email')).not.toBeInTheDocument()
		);
		expect(email).toHaveAttribute('aria-invalid', 'false');
	});

	it('shows every error on an empty submit without sending', async () => {
		render(withSite(<ContactForm />));

		fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

		expect(await screen.findByText('Name is required')).toBeInTheDocument();
		expect(screen.getByText('Email is required')).toBeInTheDocument();
		expect(screen.getByText('Message is required')).toBeInTheDocument();
		expect(sendForm).not.toHaveBeenCalled();
	});

	it('counts message characters against the limit', async () => {
		const user = userEvent.setup();
		render(withSite(<ContactForm />));

		await user.type(screen.getByLabelText(/message/i), 'Hello');

		expect(screen.getByText(/5\/500/)).toBeInTheDocument();
	});

	it('sends with the reCAPTCHA token and swaps to a success state', async () => {
		render(withSite(<ContactForm />));
		const user = await fill('Jane Doe', 'jane@example.com', 'Let us build.');

		await user.click(screen.getByRole('button', { name: 'Send message' }));

		const heading = await screen.findByRole('heading', {
			name: /thanks, jane/i,
		});
		expect(heading).toHaveFocus();
		expect(screen.getByText('jane@example.com')).toBeInTheDocument();
		expect(executeRecaptcha).toHaveBeenCalledWith('contact_form');

		const form = sendForm.mock.calls[0]![2] as HTMLFormElement;
		const data = new FormData(form);
		expect(data.get('g-recaptcha-response')).toBe('captcha-token');
		expect(data.get('name')).toBe('Jane Doe');
		expect(data.get('email')).toBe('jane@example.com');
		expect(data.get('message')).toBe('Let us build.');

		await user.click(screen.getByRole('button', { name: /send another/i }));
		expect(await screen.findByLabelText(/your name/i)).toHaveValue('');
	});

	it('keeps the form and explains when sending fails', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		sendForm.mockRejectedValue(new Error('network'));
		render(withSite(<ContactForm />));
		const user = await fill('Jane', 'jane@example.com', 'Hello there');

		await user.click(screen.getByRole('button', { name: 'Send message' }));

		await waitFor(() =>
			expect(screen.getByRole('alert')).toHaveTextContent(/didn’t go through/)
		);
		expect(screen.getByLabelText(/your name/i)).toHaveValue('Jane');
	});
});
