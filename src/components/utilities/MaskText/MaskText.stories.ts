import { Meta, StoryObj } from '@storybook/react';
import MaskText from './MaskText';

const meta: Meta<typeof MaskText> = {
	title: 'MaskText',
	component: MaskText,
};

export default meta;

type Story = StoryObj<typeof MaskText>;

export const Primary: Story = {
	args: {
		className: '',
		variant: '',
		phrases: ['Hello', 'World'],
	},
};
