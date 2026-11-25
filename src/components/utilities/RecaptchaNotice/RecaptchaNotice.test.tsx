import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RecaptchaNotice from './RecaptchaNotice';

describe('RecaptchaNotice', () => {
	it('renders the attribution with links to Google’s policies', () => {
		render(<RecaptchaNotice />);

		expect(
			screen.getByText(/protected by reCAPTCHA/i, { selector: 'p' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('link', { name: 'Privacy Policy' })
		).toHaveAttribute('href', 'https://policies.google.com/privacy');
		expect(
			screen.getByRole('link', { name: 'Terms of Service' })
		).toHaveAttribute('href', 'https://policies.google.com/terms');
	});

	it('opens the policies in a new tab without an opener', () => {
		render(<RecaptchaNotice />);

		for (const link of screen.getAllByRole('link')) {
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		}
	});

	it('merges a passed className', () => {
		render(<RecaptchaNotice className="extra" />);

		expect(
			screen.getByText(/protected by reCAPTCHA/i, { selector: 'p' })
		).toHaveClass('extra');
	});
});
