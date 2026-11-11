import type { Meta, StoryObj } from '@storybook/nextjs';
import { createElement } from 'react';

import RevealText from './RevealText';

const meta: Meta<typeof RevealText> = {
	title: 'Motion/RevealText',
	component: RevealText,
	parameters: { layout: 'padded' },
	argTypes: {
		as: {
			control: 'select',
			options: ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'div'],
		},
		trigger: { control: 'inline-radio', options: ['mount', 'inView'] },
	},
	args: {
		as: 'h1',
		trigger: 'mount',
		delay: 0,
		stagger: 0.08,
		once: true,
		children:
			'Building AI agents, guardrails and MCP infrastructure for enterprise.',
	},
	decorators: [
		(Story, { args }) =>
			createElement(
				'div',
				{
					style: {
						fontFamily: 'var(--font-display)',
						fontSize: args.as === 'p' ? 'var(--step-1)' : 'var(--step-6)',
						lineHeight:
							args.as === 'p' ? 'var(--leading-body)' : 'var(--leading-tight)',
						letterSpacing: args.as === 'p' ? 0 : 'var(--tracking-display)',
						maxWidth: args.as === 'p' ? '60ch' : '14ch',
						color: 'var(--fg)',
					},
				},
				createElement(Story)
			),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading: Story = {};

export const Paragraph: Story = {
	args: {
		as: 'p',
		stagger: 0.05,
		children:
			'Senior Technical Consultant at EY in Bangalore. Previously shipped AI tooling for a payments bank and high-traffic web platforms for entertainment brands. Resize the canvas to see lines re-measured.',
	},
};
