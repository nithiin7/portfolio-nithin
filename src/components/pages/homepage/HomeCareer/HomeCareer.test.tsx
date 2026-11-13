import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Experience } from 'types/career';

import HomeCareer from './HomeCareer';

const experience = (
	id: string,
	company: string,
	[startDate, endDate]: [string, string?],
	technologies: string[] = []
): Experience => ({
	id,
	company,
	year: startDate.slice(0, 4),
	startDate,
	endDate,
	position: `${company} engineer`,
	description: `${company} description`,
	technologies,
	duration: `${startDate} – ${endDate ?? 'Present'}`,
	location: 'Bangalore',
	type: 'full-time',
});

const experiences = [
	experience('wr', 'White Rabbit', ['2022-07-01', '2023-10-01']),
	experience('ey', 'EY', ['2026-08-01'], ['React', 'Python', 'MCP', 'Azure']),
	experience('ppb', 'Paytm', ['2023-11-01', '2025-07-01']),
];

describe('HomeCareer', () => {
	it('frames each employer logo beside the company name, hidden from assistive tech', () => {
		const withLogo: Experience = {
			...experience('ey', 'EY', ['2026-08-01']),
			employer: {
				name: 'EY',
				slug: 'ey',
				logoUrl: 'https://images.ctfassets.net/s/ey.svg',
				ratio: 0.66,
				showLogo: true,
			},
		};
		const nameOnly: Experience = {
			...experience('wr', 'White Rabbit', ['2022-07-01', '2023-10-01']),
			employer: {
				name: 'White Rabbit',
				slug: 'white-rabbit',
				ratio: 1,
				showLogo: false,
			},
		};
		const { container } = render(
			<HomeCareer experiences={[withLogo, nameOnly]} />
		);

		const marks = container.querySelectorAll('[style*="--logo"]');
		expect(marks).toHaveLength(1);
		expect(marks[0]?.closest('[aria-hidden="true"]')).not.toBeNull();
		expect(screen.getAllByRole('button')[0]).toHaveAccessibleName(
			expect.stringContaining('EY')
		);
		expect(screen.getAllByRole('button')[1]).toHaveTextContent(/White Rabbit/);
	});

	it('lists every role at once, current role first', () => {
		render(<HomeCareer experiences={experiences} />);

		const triggers = screen.getAllByRole('button');
		expect(triggers).toHaveLength(3);
		expect(triggers.map((t) => t.textContent)).toEqual([
			expect.stringContaining('2026 — NowEY'),
			expect.stringContaining('2023 — 2025Paytm'),
			expect.stringContaining('2022 — 2023White Rabbit'),
		]);
		expect(triggers[0]).toHaveTextContent('React, Python, MCP +1');
		expect(screen.getByText('03 roles · 2022 — Now')).toBeInTheDocument();
	});

	it('opens the latest role by default and toggles one row at a time', () => {
		render(<HomeCareer experiences={experiences} />);
		const [ey, paytm] = screen.getAllByRole('button') as [
			HTMLElement,
			HTMLElement,
		];

		expect(ey).toHaveAttribute('aria-expanded', 'true');
		const region = screen.getByRole('region', { name: 'EY engineer at EY' });
		expect(within(region).getByText('EY description')).toBeInTheDocument();
		expect(
			within(region)
				.getAllByRole('listitem')
				.map((li) => li.textContent)
		).toEqual(['React', 'Python', 'MCP', 'Azure']);

		fireEvent.click(paytm);
		expect(paytm).toHaveAttribute('aria-expanded', 'true');
		expect(ey).toHaveAttribute('aria-expanded', 'false');

		fireEvent.click(paytm);
		expect(paytm).toHaveAttribute('aria-expanded', 'false');
	});

	it('renders nothing without experiences', () => {
		const { container } = render(<HomeCareer experiences={[]} />);
		expect(container).toBeEmptyDOMElement();
	});
});
