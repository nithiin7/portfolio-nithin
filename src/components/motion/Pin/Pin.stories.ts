import type { Meta, StoryObj } from '@storybook/nextjs';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { createElement, type ReactElement } from 'react';

import Pin from './Pin';

const Spacer = (label: string): ReactElement =>
	createElement(
		'div',
		{
			style: {
				height: '80vh',
				display: 'grid',
				placeItems: 'center',
				fontFamily: 'var(--font-mono)',
				color: 'var(--muted)',
			},
		},
		label
	);

const Scrubbed = ({
	progress,
}: {
	progress: MotionValue<number>;
}): ReactElement => {
	const scale = useTransform(progress, [0, 1], [1, 0.92]);

	return createElement(
		'div',
		{
			style: {
				height: '100%',
				display: 'grid',
				placeContent: 'center',
				gap: 'var(--space-5)',
				padding: 'var(--grid-margin)',
				background: 'var(--surface-1)',
				color: 'var(--fg)',
			},
		},
		createElement(
			motion.h2,
			{
				style: {
					scale,
					fontFamily: 'var(--font-display)',
					fontSize: 'var(--step-6)',
					lineHeight: 'var(--leading-tight)',
					letterSpacing: 'var(--tracking-display)',
					fontWeight: 500,
				},
			},
			'Pinned'
		),
		createElement(motion.div, {
			style: {
				scaleX: progress,
				transformOrigin: '0 50%',
				height: 2,
				background: 'var(--accent)',
			},
		})
	);
};

const meta: Meta<typeof Pin> = {
	title: 'Motion/Pin',
	component: Pin,
	parameters: { layout: 'fullscreen' },
	args: { distance: 1.5 },
	render: (args) =>
		createElement(
			'div',
			null,
			Spacer('Scroll down ↓'),
			createElement(Pin, {
				...args,
				children: (progress: MotionValue<number>) =>
					createElement(Scrubbed, { progress }),
			}),
			Spacer('End of pinned range')
		),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ScrollScrubbed: Story = {};
