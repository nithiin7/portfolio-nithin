import { describe, expect, it } from 'vitest';

import { shareLinks } from 'helpers/social';

describe('shareLinks', () => {
	it('builds encoded intent URLs for each network', () => {
		const links = shareLinks({
			url: 'https://site.dev/blog/a b',
			title: 'MCP & you',
		});

		expect(links.map((link) => link.label)).toEqual([
			'X',
			'LinkedIn',
			'WhatsApp',
			'Email',
		]);
		expect(links[0]?.href).toBe(
			'https://twitter.com/intent/tweet?url=https%3A%2F%2Fsite.dev%2Fblog%2Fa%20b&text=MCP%20%26%20you'
		);
		expect(links[3]?.href).toBe(
			'mailto:?subject=MCP%20%26%20you&body=https%3A%2F%2Fsite.dev%2Fblog%2Fa%20b'
		);
	});
});
