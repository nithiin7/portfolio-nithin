import type { Meta, StoryObj } from '@storybook/nextjs';
import { motionValue } from 'motion/react';
import { createElement, useEffect, useMemo, useState } from 'react';

import ScrambleText from './ScrambleText';
import type { ScrambleTextProps } from './ScrambleText';

const display = {
	fontFamily: 'var(--font-display)',
	fontSize: 'var(--step-6)',
	lineHeight: 'var(--leading-tight)',
	letterSpacing: 'var(--tracking-display)',
	fontWeight: 500,
	maxWidth: '14ch',
	color: 'var(--fg)',
};

const meta: Meta<typeof ScrambleText> = {
	title: 'Motion/ScrambleText',
	component: ScrambleText,
	parameters: { layout: 'padded' },
	argTypes: {
		as: {
			control: 'select',
			options: ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'div'],
		},
		mode: { control: 'inline-radio', options: ['enter', 'hover'] },
	},
	args: {
		as: 'h2',
		mode: 'enter',
		duration: 0.6,
		delay: 0,
		text: 'Selected works.',
	},
	decorators: [
		(Story) => createElement('div', { style: display }, createElement(Story)),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Plays once as it scrolls into view. Remount (re-select the story) to replay. */
export const Enter: Story = {};

/** Long text that wraps: resize the canvas, nothing reflows mid-animation. */
export const Wrapping: Story = {
	args: {
		text: 'Building AI agents, guardrails and MCP infrastructure for enterprise.',
		duration: 1.2,
	},
};

/** Hover or tab to the link; the title decodes again. */
export const Hover: Story = {
	args: { mode: 'hover', as: 'span', text: 'Orbit design system' },
	decorators: [
		(Story) =>
			createElement(
				'a',
				{ href: '#', style: { color: 'inherit', textDecoration: 'none' } },
				createElement(Story)
			),
	],
};

const ScrollDemo = (args: ScrambleTextProps) => {
	const progress = useMemo(() => motionValue(0), []);
	const [value, setValue] = useState(0);
	useEffect(() => progress.set(value), [progress, value]);
	return createElement(
		'div',
		null,
		createElement('input', {
			type: 'range',
			min: 0,
			max: 1,
			step: 0.01,
			value,
			'aria-label': 'Progress',
			onChange: (e: { target: { value: string } }) =>
				setValue(Number(e.target.value)),
			style: { width: '100%', marginBottom: '2rem' },
		}),
		createElement(ScrambleText, { ...args, mode: 'scroll', progress })
	);
};

/** Scroll mode, scrubbed with a slider standing in for scroll progress. */
export const Scroll: Story = {
	args: { text: 'Text-to-Query systems' },
	render: (args) => createElement(ScrollDemo, args),
};
