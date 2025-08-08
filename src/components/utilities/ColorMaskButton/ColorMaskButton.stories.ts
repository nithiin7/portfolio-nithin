import type { Meta, StoryObj } from '@storybook/nextjs';

import ColorMaskButton from './ColorMaskButton';

const meta: Meta<typeof ColorMaskButton> = {
	title: 'ColorMaskButton',
	component: ColorMaskButton,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {},
};
