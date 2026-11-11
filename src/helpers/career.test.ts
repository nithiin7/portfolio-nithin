import { describe, expect, it } from 'vitest';

import { transformCareerData, yearsOfExperience } from 'helpers/career';

describe('transformCareerData', () => {
	it('maps raw Contentful fields to the HomeCareer shape', () => {
		const result = transformCareerData({
			data: { title: 'Career', subTitle: 'My journey' },
			career: [
				{
					sys: { id: 'exp-1' },
					title: 'Full Stack Developer',
					company: 'Acme',
					year: '2024',
					duration: '2 yrs',
					location: 'Remote',
					type: 'contract',
					description: 'Built things',
					technologies: 'React, Node.js',
				},
			],
		});

		expect(result.data).toEqual({ title: 'Career', subtitle: 'My journey' });
		expect(result.experiences).toEqual([
			{
				id: 'exp-1',
				year: '2024',
				company: 'Acme',
				position: 'Full Stack Developer',
				description: 'Built things',
				technologies: ['React', 'Node.js'],
				duration: '2 yrs',
				location: 'Remote',
				type: 'contract',
			},
		]);
	});

	it('falls back to title as id and defaults missing fields', () => {
		const result = transformCareerData({
			data: {},
			career: [{ title: 'Developer' }],
		});

		expect(result.experiences[0]).toEqual({
			id: 'Developer',
			year: '',
			company: '',
			position: 'Developer',
			description: '',
			technologies: [],
			duration: '',
			location: undefined,
			type: 'full-time',
		});
	});

	it('handles an empty career list', () => {
		expect(transformCareerData({ data: {}, career: [] }).experiences).toEqual(
			[]
		);
	});
});

describe('yearsOfExperience', () => {
	const durations = [
		'Aug 2026 - Present ',
		'July 2025 - Aug 2026',
		'July 2022 - October 2023 (1 year 4 months)',
	];

	it('counts whole years from the earliest start date', () => {
		expect(yearsOfExperience(durations, new Date(2026, 10, 11))).toBe(4);
		expect(yearsOfExperience(durations, new Date(2026, 5, 30))).toBe(3);
	});

	it('returns null when nothing parses', () => {
		expect(yearsOfExperience(['', 'Present', '2 yrs'])).toBeNull();
	});
});
