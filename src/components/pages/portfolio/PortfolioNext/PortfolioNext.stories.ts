import type { Meta, StoryObj } from '@storybook/nextjs';

import PortfolioNext from './PortfolioNext';

const cover =
	'data:image/svg+xml;utf8,' +
	encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#262523"/><g stroke="#ff4d00" stroke-width="2" fill="none"><circle cx="800" cy="450" r="300"/><path d="M0 900 1600 0M0 0l1600 900"/></g></svg>`
	);

const meta: Meta<typeof PortfolioNext> = {
	title: 'Pages/Portfolio/PortfolioNext',
	component: PortfolioNext,
	parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof PortfolioNext>;

/** Hover (or Tab to) the link to see the cover clip-wipe in behind the title. */
export const Primary: Story = {
	args: {
		next: {
			id: 3,
			slug: 'remote-file-server-mcp',
			title: 'Remote File Server MCP',
			image: cover,
			position: 3,
			total: 13,
		},
	},
};

export const WithoutCover: Story = {
	args: {
		next: {
			id: 3,
			slug: 'remote-file-server-mcp',
			title: 'Remote File Server MCP',
			position: 3,
			total: 13,
		},
	},
};
