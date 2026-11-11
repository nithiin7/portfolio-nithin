import type { Meta, StoryObj } from '@storybook/nextjs';
import { createElement } from 'react';

import RevealImage from './RevealImage';

const placeholder =
	'data:image/svg+xml;utf8,' +
	encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#262523"/><g stroke="#ff4d00" stroke-width="2" fill="none"><circle cx="400" cy="500" r="260"/><path d="M0 1000 800 0M0 0l800 1000"/></g></svg>`
	);

const meta: Meta<typeof RevealImage> = {
	title: 'Motion/RevealImage',
	component: RevealImage,
	parameters: { layout: 'centered' },
	argTypes: {
		trigger: { control: 'inline-radio', options: ['mount', 'inView'] },
	},
	args: {
		trigger: 'mount',
		delay: 0,
		once: true,
	},
	render: (args) =>
		createElement(
			'div',
			{ style: { width: 'min(80vw, 420px)', aspectRatio: '4 / 5' } },
			createElement(
				RevealImage,
				{ ...args, className: undefined },
				createElement('img', {
					src: placeholder,
					alt: 'Abstract placeholder',
					style: { width: '100%', height: '100%' },
				})
			)
		),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OnMount: Story = {};

export const OnScroll: Story = {
	args: { trigger: 'inView' },
	parameters: { layout: 'padded' },
	decorators: [
		(Story) =>
			createElement(
				'div',
				null,
				createElement(
					'p',
					{
						style: {
							height: '110vh',
							fontFamily: 'var(--font-mono)',
							color: 'var(--muted)',
						},
					},
					'Scroll down ↓'
				),
				createElement(Story)
			),
	],
};
