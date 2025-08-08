import type { Meta, StoryObj } from '@storybook/nextjs';

import TransitionSVG from './TransitionSVG';

const meta = {
	title: 'Components/Utilities/TransitionSVG',
	component: TransitionSVG,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		width: {
			control: { type: 'number' },
		},
		height: {
			control: { type: 'number' },
		},
	},
} satisfies Meta<typeof TransitionSVG>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		width: 800,
		height: 600,
	},
};

export const Mobile: Story = {
	args: {
		width: 375,
		height: 812,
	},
};

export const Desktop: Story = {
	args: {
		width: 1920,
		height: 1080,
	},
};
