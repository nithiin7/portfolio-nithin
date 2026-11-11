import { siteConfig } from 'config/site';

// Owned in code rather than Contentful: the CMS "Home - About" Description
// entry is stale (Paytm) and the section has no fields for principles/stats.
export const aboutContent = {
	bio: [
		`I'm Nithin, a ${siteConfig.role} at ${siteConfig.company} in ${siteConfig.location.city}. I build AI agents, guardrails and MCP infrastructure for enterprise teams — and the full-stack products that put them in people's hands.`,
		'Before EY I spent four years shipping at Paytm Payments Bank and White Rabbit Group: RAG pipelines and LLM query agents for compliance and finance teams, and web platforms for Spotify and The Game Awards that held up under a million concurrent users.',
	],
	howIWork: [
		{
			title: 'Thin slice first',
			body: 'A working end-to-end path in week one, then widen it.',
		},
		{
			title: 'Guardrails ship with the feature',
			body: 'Evals, fallbacks and audit trails land with the agent, not after it.',
		},
		{
			title: 'Measure, then optimise',
			body: 'Budgets for latency, cost and Core Web Vitals, checked in CI.',
		},
		{
			title: 'Write it down',
			body: 'Decision records and READMEs a new teammate can follow alone.',
		},
	],
	peakConcurrentUsers: 1_000_000,
} as const;
