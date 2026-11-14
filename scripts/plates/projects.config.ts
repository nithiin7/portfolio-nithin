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
				// The session is illustrative: the tools, the traversal denial and the
				// audit fields are the server's documented behaviour.
				template: 'scene',
				name: 'scene',
				label: 'Remote File Server MCP',
				tag: 'MCP · SMB/CIFS',
				text: 'Read-only file shares for any MCP client — signed, audited, traversal-proof.',
				illustration: {
					kind: 'terminal',
					title: 'mcp · remote-file-server',
					lines: [
						[
							['$ ', 'accent'],
							['ask ', 'fg'],
							['"Summarise the Q3 report on the share"', 'muted'],
						],
						[
							['→ ', 'muted'],
							['list_files   ', 'fg'],
							['/reports/2026          ', 'muted'],
							['12 files', 'fg'],
						],
						[
							['→ ', 'muted'],
							['read_file    ', 'fg'],
							['/reports/2026/q3.pdf   ', 'muted'],
							['ok · 184 KB', 'fg'],
						],
						[
							['→ ', 'muted'],
							['read_file    ', 'fg'],
							['../../config/.env      ', 'muted'],
							['denied · traversal', 'accent'],
						],
						[
							['✓ ', 'accent'],
							['audit        ', 'fg'],
							[
								'{ signed: true, tool: "read_file", ok: 1, denied: 1 }',
								'muted',
							],
						],
					],
				},
				use: ['card', 'spotlight'],
				alt: 'Terminal session with the MCP file server: an assistant lists and reads a report from an SMB share, a path-traversal read of a .env file is denied, and the signed call is written to the audit log.',
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
				alt: 'Code listing the server’s tools (list, read, search, metadata) and its safeguards: SMB signing, traversal blocking, denied files, audit log.',
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
				// Generic question and schema: the real databases are a client's.
				template: 'scene',
				name: 'scene',
				label: 'Lang2Query',
				tag: 'LangGraph · 5 agents',
				text: 'Plain-English questions in, validated SQL out — five agents, one pipeline.',
				illustration: {
					kind: 'pipeline',
					question: 'Which five cities added the most users last month?',
					steps: ['Database', 'Tables', 'Columns', 'Generate', 'Validate'],
					outputLabel: 'query.sql',
					output: [
						[
							['SELECT ', 'muted'],
							['city, COUNT(*) AS new_users ', 'fg'],
							['FROM ', 'muted'],
							['users', 'fg'],
						],
						[
							['WHERE ', 'muted'],
							[
								"created_at >= date_trunc('month', now()) - interval '1 month'",
								'fg',
							],
						],
						[
							['GROUP BY ', 'muted'],
							['city ', 'fg'],
							['ORDER BY ', 'muted'],
							['new_users ', 'fg'],
							['DESC LIMIT ', 'muted'],
							['5;', 'fg'],
						],
					],
				},
				use: ['card', 'spotlight'],
				alt: 'A plain-English question flows through five agents (database, tables, columns, generate, validate) and comes out as a validated SQL query.',
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
				// Illustrative run in a simulated account; the tools and models are
				// the ones the README lists.
				template: 'scene',
				name: 'scene',
				label: 'AI Stock Market Trader',
				tag: 'OpenAI Agents SDK · Polygon',
				text: 'Autonomous trading agents on live market data — with the model you choose.',
				illustration: {
					kind: 'market',
					title: 'tradeit · simulated account',
					symbol: 'NVDA',
					price: '$142.18',
					change: '+2.4%',
					points: [
						131, 133, 132, 135, 134, 137, 136, 133, 130.5, 129, 131, 130, 132.5,
						135, 134, 137.5, 139, 138, 140.5, 139.5, 141, 143, 142,
					],
					marker: { index: 9, label: 'BUY 40' },
					lines: [
						[
							['→ ', 'muted'],
							['market_data  ', 'fg'],
							['polygon', 'muted'],
						],
						[
							['→ ', 'muted'],
							['model        ', 'fg'],
							['deepseek', 'muted'],
						],
						[
							['→ ', 'muted'],
							['decide       ', 'fg'],
							['buy 40 @ 129.00', 'muted'],
						],
						[
							['✓ ', 'accent'],
							['execute      ', 'fg'],
							['filled', 'accent'],
						],
						[
							['→ ', 'muted'],
							['stop_loss    ', 'fg'],
							['122.55', 'muted'],
						],
						[
							['→ ', 'muted'],
							['portfolio    ', 'fg'],
							['+$527.20', 'fg'],
						],
					],
				},
				use: ['card', 'spotlight'],
				alt: 'Trading dashboard in a simulated account: a price chart with the agent’s buy point marked, beside its log of market data, chosen model, decision, filled order and stop loss.',
			},
		],
	},
]);
