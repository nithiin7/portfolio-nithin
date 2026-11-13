import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Collaborator } from 'types/home';

import HomeCollaborations from './HomeCollaborations';

const collaborators: Collaborator[] = ['EY', 'HSBC', 'Spotify'].map((name) => ({
	name,
	url: `https://${name.toLowerCase()}.example`,
	logoUrl: `https://images.ctfassets.net/s/${name}.svg`,
	ratio: '3 / 1',
	tall: false,
}));

describe('HomeCollaborations', () => {
	it('exposes each logo link once, with the marquee copy hidden', () => {
		render(<HomeCollaborations collaborators={collaborators} />);

		const links = screen.getAllByRole('link');
		expect(links.map((link) => link.textContent)).toEqual([
			'EY (opens in a new tab)',
			'HSBC (opens in a new tab)',
			'Spotify (opens in a new tab)',
		]);
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^03/);
	});

	it('toggles the marquee between paused and playing', () => {
		render(<HomeCollaborations collaborators={collaborators} />);

		const toggle = screen.getByRole('button', { name: /logo marquee/ });
		expect(toggle).toHaveAttribute('aria-pressed', 'false');
		fireEvent.click(toggle);
		expect(toggle).toHaveAttribute('aria-pressed', 'true');
		expect(toggle).toHaveTextContent(/^Play/);
	});
});
