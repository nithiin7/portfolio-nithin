import type { Meta, StoryObj } from '@storybook/react';

import { PortfolioAnimations } from './PortfolioAnimations';

const meta: Meta<typeof PortfolioAnimations> = {
	title: 'PortfolioAnimations',
	component: PortfolioAnimations,
};

export default meta;

type Story = StoryObj<typeof PortfolioAnimations>;

export const Primary: Story = {
	args: {
		className: '',
		animation: 'fadeIn',
	},
};
