import { describe, expect, it } from 'vitest';

import {
	careerPeriod,
	formatMonthYear,
	sortByStart,
	toExperience,
	yearsOfExperience,
} from 'helpers/career';

const role = (startDate: string, endDate?: string, type = 'full-time') => ({
	sys: { id: `role-${startDate}` },
	title: 'Engineer',
	companyName: 'Acme',
	location: 'Bangalore, India',
	type,
	startDate,
	endDate,
	description: 'Built things.',
	techStack: ['React', 'Node.js'],
});

describe('formatMonthYear', () => {
	it('formats a Contentful date in UTC', () => {
		expect(formatMonthYear('2026-08-01')).toBe('Aug 2026');
	});

	it('keeps the month for a first-of-month date at a local midnight', () => {
		expect(formatMonthYear('2026-08-01T00:00:00.000+05:30')).toBe('Aug 2026');
	});
});

describe('toExperience', () => {
	it('maps a Career Role entry to the component shape', () => {
		expect(toExperience(role('2025-07-01', '2026-08-01'))).toEqual({
			id: 'role-2025-07-01',
			year: '2025',
			company: 'Acme',
			position: 'Engineer',
			description: 'Built things.',
			technologies: ['React', 'Node.js'],
			duration: 'Jul 2025 – Aug 2026',
			startDate: '2025-07-01',
			endDate: '2026-08-01',
			location: 'Bangalore, India',
			type: 'full-time',
		});
	});

	it('takes the company name and logo from the employer reference', () => {
		const experience = toExperience({
			...role('2026-08-01'),
			employer: {
				name: 'EY',
				slug: 'ey',
				websiteUrl: 'https://www.ey.com/',
				showLogo: true,
				logo: { url: '//images.ctfassets.net/ey.svg', width: 69, height: 104 },
			},
		});
		expect(experience.company).toBe('EY');
		expect(experience.employer).toEqual({
			name: 'EY',
			slug: 'ey',
			logoUrl: 'https://images.ctfassets.net/ey.svg',
			ratio: 69 / 104,
			showLogo: true,
			url: 'https://www.ey.com/',
		});
	});

	it('falls back to the deprecated company text without an employer', () => {
		const experience = toExperience(role('2026-08-01'));
		expect(experience.company).toBe('Acme');
		expect(experience.employer).toBeUndefined();
	});

	it('shows an open role as Present and defaults unknown types', () => {
		const experience = toExperience(role('2026-08-01', undefined, 'other'));
		expect(experience.duration).toBe('Aug 2026 – Present');
		expect(experience.endDate).toBeUndefined();
		expect(experience.type).toBe('full-time');
	});
});

describe('sortByStart', () => {
	it('puts the newest role first', () => {
		const sorted = sortByStart(
			['2022-07-01', '2026-08-01', '2025-07-01'].map((date) =>
				toExperience(role(date))
			)
		);
		expect(sorted.map((e) => e.startDate)).toEqual([
			'2026-08-01',
			'2025-07-01',
			'2022-07-01',
		]);
	});
});

describe('yearsOfExperience', () => {
	const starts = ['2026-08-01', '2025-07-01', '2022-07-01'];

	it('counts whole years from the earliest start date', () => {
		expect(yearsOfExperience(starts, new Date(Date.UTC(2026, 10, 11)))).toBe(4);
		expect(yearsOfExperience(starts, new Date(Date.UTC(2026, 5, 30)))).toBe(3);
	});

	it('returns null without roles', () => {
		expect(yearsOfExperience([])).toBeNull();
	});
});

describe('careerPeriod', () => {
	it('marks a role without an end date as current', () => {
		expect(careerPeriod({ startDate: '2026-08-01' })).toEqual({
			start: '2026',
			end: null,
			current: true,
		});
	});

	it('reads start and end years from a closed range', () => {
		expect(
			careerPeriod({ startDate: '2022-07-01', endDate: '2023-10-01' })
		).toEqual({ start: '2022', end: '2023', current: false });
	});

	it('collapses a same-year range to a single year', () => {
		expect(
			careerPeriod({ startDate: '2021-01-01', endDate: '2021-06-01' })
		).toEqual({ start: '2021', end: null, current: false });
	});
});
