import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { siteFixture, withSite } from 'test/fixtures';
import type { Certification } from 'types/certification';

import HomeCertifications from './HomeCertifications';

const cert = (name: string, highlight = false): Certification => ({
	id: name,
	name,
	provider: 'AWS',
	logo: `https://images.ctfassets.net/${name}.png`,
	issuedDate: '2024-01-01',
	highlight,
});

describe('HomeCertifications', () => {
	it('shows the count, a badge per certification and the Credly link', () => {
		render(
			withSite(
				<HomeCertifications
					certifications={[
						cert('Solutions Architect', true),
						cert('Developer'),
					]}
				/>
			)
		);

		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
			'02 Certifications.'
		);
		expect(
			screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'))
		).toEqual([
			'Solutions Architect, AWS. View details',
			'Developer, AWS. View details',
		]);
		expect(screen.getByRole('link', { name: /Credly/ })).toHaveAttribute(
			'href',
			siteFixture.socials.find((link) => link.icon === 'credly')?.url
		);
	});

	it('renders nothing without certifications', () => {
		const { container } = render(
			withSite(<HomeCertifications certifications={[]} />)
		);
		expect(container).toBeEmptyDOMElement();
	});
});
