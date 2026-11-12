// Plate recipes per portfolio project. Slugs match PortfolioDetails.slug.
// See docs/redesign/IMAGES.md for the workflow and alt-text rules.
import { defineProjects } from './shared.ts';

export default defineProjects([
	{
		// Imported: raw/persona-ai-resume-builder/desktop-{1..4}.png are the
		// existing 3024×17xx retina gallery screenshots.
		slug: 'persona-ai-resume-builder',
		surface: 'paper',
		grid: true,
		screens: [
			{ name: 'desktop-1', device: 'desktop' },
			{ name: 'desktop-2', device: 'desktop' },
		],
		plates: [
			{
				template: 'cover',
				screen: 'desktop-1',
				use: ['card', 'spotlight'],
				alt: 'Persona resume editor: section tabs and profile form on the left, live resume preview on the right.',
			},
			{
				template: 'detail',
				name: 'detail-suggestions',
				screen: 'desktop-2',
				region: { x: 46, y: 150, width: 552, height: 270 },
				zoom: 2.5,
				surface: 'ink',
				use: ['gallery'],
				alt: 'Close-up of an AI suggestion in Persona, with added keywords highlighted in green and Reject / Accept buttons.',
			},
		],
	},
	{
		// No UI: an MCP server, so it gets type plates.
		slug: 'remote-file-server-mcp',
		surface: 'ink',
		grid: true,
		plates: [
			{
				template: 'type-plate',
				variant: 'statement',
				label: 'Remote File Server MCP',
				text: 'Read-only access to SMB file shares for any MCP client — signed, audited, and traversal-proof.',
				use: ['card', 'spotlight'],
				alt: 'Statement: read-only access to SMB file shares for any MCP client, signed, audited and traversal-proof.',
			},
			{
				// Summarises data/knowledge/project-remote-file-server-mcp.md; swap in
				// a real excerpt from the repo when one reads better.
				template: 'type-plate',
				name: 'type-capabilities',
				variant: 'code',
				label: 'remote-file-server-mcp · capabilities.yaml',
				surface: 'paper',
				text: [
					'# Read-only SMB/CIFS access for any MCP client',
					'tools:',
					'  - list files',
					'  - read text + binary files',
					'  - glob search',
					'  - file metadata',
					'',
					'security:',
					'  smb_signing:     enforced',
					'  path_traversal:  blocked',
					'  sensitive_files: denied      # .env, keys, certs',
					'  audit_log:       json',
					'  credentials:     env only    # never in tool calls',
				].join('\n'),
				use: ['gallery'],
				alt: 'Code excerpt listing the server’s tools (list, read, glob search, metadata) and security settings: SMB signing enforced, path traversal blocked, sensitive files denied, JSON audit log.',
			},
		],
	},
]);
