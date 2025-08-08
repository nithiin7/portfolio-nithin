import type { Meta, StoryObj } from '@storybook/nextjs';

import FloatingChat from './FloatingChat';

const meta: Meta<typeof FloatingChat> = {
	title: 'Utilities/FloatingChat',
	component: FloatingChat,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		chatbotUrl: {
			control: 'text',
			description: 'URL of the chatbot iframe',
		},
	},
	args: {
		chatbotUrl: 'https://nithiin7-portfolio-resume.hf.space',
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		chatbotUrl: 'https://nithiin7-portfolio-resume.hf.space',
	},
};

export const CustomUrl: Story = {
	args: {
		chatbotUrl: 'https://example.com/chat',
	},
};
