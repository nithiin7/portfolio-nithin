import type { Meta, StoryObj } from '@storybook/nextjs';
import { createElement } from 'react';

import CaseStudyProgress from './CaseStudyProgress';

const sections = [
	{ id: 'problem', label: 'Problem' },
	{ id: 'approach', label: 'Approach' },
	{ id: 'architecture', label: 'Architecture' },
	{ id: 'outcome', label: 'Outcome' },
];

const meta: Meta<typeof CaseStudyProgress> = {
	title: 'Pages/Portfolio/CaseStudyProgress',
	component: CaseStudyProgress,
	parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof CaseStudyProgress>;

/** Scroll the canvas: the rail fills and the active section follows. */
export const Primary: Story = {
	args: {
		sections,
		children: sections.map(({ id, label }) =>
			createElement(
				'section',
				{ key: id, id, tabIndex: -1, style: { minHeight: '90vh' } },
				createElement('h2', null, label)
			)
		),
	},
};
