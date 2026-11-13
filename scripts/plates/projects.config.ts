// Plate recipes per portfolio project, in homepage works order. Slugs match
// PortfolioDetails.slug. Covers render on both surfaces (-ink / -paper) so the
// site can show the one matching its theme.
// See docs/redesign/IMAGES.md for the workflow and alt-text rules.
import { defineProjects } from './shared.ts';

// Screens taken under `next dev` carry its "N" badge in the bottom-left corner
const NEXT_DEV_BADGE = { bottom: 64 };

export default defineProjects([
	{
		// Imported from the repo's docs/screenshots (2560 px wide, @2x).
		slug: 'orbit',
		surface: ['ink', 'paper'],
		grid: true,
		screens: [
			{ name: 'dashboard-dark_mode', device: 'desktop' },
			{ name: 'dashboard-light_mode', device: 'desktop' },
		],
		plates: [
			{
				template: 'cover',
				screen: { ink: 'dashboard-dark_mode', paper: 'dashboard-light_mode' },
				use: ['card', 'spotlight'],
				alt: 'Orbit dashboard: a greeting, quick-add actions, and cards for today’s agenda, tasks, habits, notes, documents and budget.',
			},
		],
	},
	{
		// Imported: the existing 3024×17xx retina gallery screenshots.
		slug: 'persona',
		surface: ['ink', 'paper'],
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
		surface: ['ink', 'paper'],
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
	{
		// Imported from the existing gallery (@2x).
		slug: 'repochat',
		surface: ['ink', 'paper'],
		grid: true,
		screens: [{ name: 'gallery-1', device: 'desktop', trim: NEXT_DEV_BADGE }],
		plates: [
			{
				template: 'cover',
				screen: 'gallery-1',
				use: ['card', 'spotlight'],
				alt: 'RepoChat landing page, “Ask anything about any codebase”, above a sample chat explaining a repository’s auth middleware.',
			},
		],
	},
	{
		// Imported from the existing gallery (@2x).
		slug: 'plateai',
		surface: ['ink', 'paper'],
		grid: true,
		screens: [{ name: 'gallery-1', device: 'desktop', trim: NEXT_DEV_BADGE }],
		plates: [
			{
				template: 'cover',
				screen: 'gallery-1',
				use: ['card', 'spotlight'],
				alt: 'PlateAI upload screen: a photo of butter chicken, detected as “butter chicken”, with options to generate a recipe or view ingredients.',
			},
		],
	},
	{
		// The only screenshot is an empty chat, so the cover states what it does.
		slug: 'lang2query',
		surface: ['ink', 'paper'],
		grid: true,
		plates: [
			{
				template: 'type-plate',
				variant: 'statement',
				label: 'Lang2Query',
				text: 'Plain-English questions in, validated SQL out — five agents in one LangGraph pipeline.',
				use: ['card', 'spotlight'],
				alt: 'Statement: plain-English questions in, validated SQL out, from five agents in one LangGraph pipeline.',
			},
		],
	},
	{
		// No screenshots in the repo; facts from its README.
		slug: 'tradeit',
		surface: ['ink', 'paper'],
		grid: true,
		plates: [
			{
				template: 'type-plate',
				variant: 'statement',
				label: 'AI Stock Market Trader',
				text: 'Trading agents that read live market data and act through MCP tools — on the model you choose.',
				use: ['card', 'spotlight'],
				alt: 'Statement: trading agents that read live market data and act through MCP tools, on the model you choose.',
			},
		],
	},
]);
