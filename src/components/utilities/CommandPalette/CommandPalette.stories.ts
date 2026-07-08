import type { Meta, StoryObj } from '@storybook/nextjs';
import { createElement } from 'react';

import { ThemeProvider } from 'contexts/ThemeContext';

import CommandPalette from './CommandPalette';

const meta: Meta<typeof CommandPalette> = {
	title: 'Utilities/CommandPalette',
	component: CommandPalette,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => createElement(ThemeProvider, null, createElement(Story)),
	],
	argTypes: {
		resumeUrl: {
			control: 'text',
			description: 'URL of the resume PDF',
		},
	},
	args: {
		resumeUrl: '/resume.pdf',
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		resumeUrl: '/resume.pdf',
	},
};
