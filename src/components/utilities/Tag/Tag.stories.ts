import type { Meta, StoryObj } from '@storybook/react';

import Tag from './Tag';

const meta: Meta<typeof Tag> = {
	title: 'Components/Utilities/Tag',
	component: Tag,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: ['default', 'primary', 'secondary', 'accent'],
		},
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large'],
		},
		animated: {
			control: { type: 'boolean' },
		},
		delay: {
			control: { type: 'number', min: 0, max: 2, step: 0.1 },
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Default Tag',
		variant: 'default',
		size: 'medium',
		animated: true,
	},
};

export const Primary: Story = {
	args: {
		children: 'Primary Tag',
		variant: 'primary',
		size: 'medium',
		animated: true,
	},
};

export const Secondary: Story = {
	args: {
		children: 'Secondary Tag',
		variant: 'secondary',
		size: 'medium',
		animated: true,
	},
};

export const Accent: Story = {
	args: {
		children: 'Accent Tag',
		variant: 'accent',
		size: 'medium',
		animated: true,
	},
};

export const Small: Story = {
	args: {
		children: 'Small Tag',
		variant: 'default',
		size: 'small',
		animated: true,
	},
};

export const Large: Story = {
	args: {
		children: 'Large Tag',
		variant: 'default',
		size: 'large',
		animated: true,
	},
};

export const NonAnimated: Story = {
	args: {
		children: 'Non-Animated Tag',
		variant: 'default',
		size: 'medium',
		animated: false,
	},
};
