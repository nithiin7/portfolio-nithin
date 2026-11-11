import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomeCollaborations from './HomeCollaborations';

describe('HomeCollaborations', () => {
	it('exposes each logo link once, with the marquee copy hidden', () => {
		render(<HomeCollaborations />);

		const links = screen.getAllByRole('link');
		expect(links.map((link) => link.textContent)).toEqual([
			'EY (opens in a new tab)',
			'HSBC (opens in a new tab)',
			'Morgan Stanley (opens in a new tab)',
			'Paytm Payments Bank (opens in a new tab)',
			'Spotify (opens in a new tab)',
			'Spotify Codes (opens in a new tab)',
			'The Game Awards (opens in a new tab)',
			'White Rabbit (opens in a new tab)',
		]);
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^08/);
	});

	it('toggles the marquee between paused and playing', () => {
		render(<HomeCollaborations />);

		const toggle = screen.getByRole('button', { name: /logo marquee/ });
		expect(toggle).toHaveAttribute('aria-pressed', 'false');
		fireEvent.click(toggle);
		expect(toggle).toHaveAttribute('aria-pressed', 'true');
		expect(toggle).toHaveTextContent(/^Play/);
	});
});
