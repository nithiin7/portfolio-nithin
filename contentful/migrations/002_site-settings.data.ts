/**
 * Seeds Site Settings and the homepage building blocks from what the code
 * held before phase 14 (src/config/site.ts, src/config/about.ts,
 * src/constants) and the old Services entries. Copy is
 * moved as-is; rewrites go through docs/cms/COPY_REVIEW.md. Drafts only.
 */
import { link, value, type Client } from '../lib/cma.ts';

const socials = [
	{
		id: 'instagram',
		label: 'Instagram',
		url: 'https://www.instagram.com/__nithiin__/',
	},
	{ id: 'x', label: 'X', url: 'https://twitter.com/_nithiin7' },
	{
		id: 'linkedin',
		label: 'LinkedIn',
		url: 'https://www.linkedin.com/in/nithin-p7/',
	},
	{
		id: 'bitbucket',
		label: 'Bitbucket',
		url: 'https://bitbucket.org/nithin-private/workspace/repositories/',
	},
	{ id: 'github', label: 'GitHub', url: 'https://github.com/nithiin7' },
	{
		id: 'credly',
		label: 'Credly',
		url: 'https://www.credly.com/users/nithin-pradeep.53925824',
	},
	{ id: 'devto', label: 'DEV', url: 'https://dev.to/nithiin7' },
];

const contactChannels = [
	{
		id: 'email',
		label: 'Email',
		detail: 'nithinp150@gmail.com',
		url: 'mailto:nithinp150@gmail.com',
		newTab: false,
	},
	{
		id: 'whatsapp',
		label: 'WhatsApp',
		detail: '+91-9645018007',
		url: 'https://api.whatsapp.com/send?phone=+919645018007',
		newTab: true,
	},
	{
		id: 'messenger',
		label: 'Messenger',
		detail: 'Nithin Pradeep',
		url: 'https://m.me/i.am.np.007',
		newTab: true,
	},
];

const principles = [
	{
		id: 'thin-slice-first',
		title: 'Thin slice first',
		body: 'A working end-to-end path in week one, then widen it.',
	},
	{
		id: 'guardrails-ship-with-the-feature',
		title: 'Guardrails ship with the feature',
		body: 'Evals, fallbacks and audit trails land with the agent, not after it.',
	},
	{
		id: 'measure-then-optimise',
		title: 'Measure, then optimise',
		body: 'Budgets for latency, cost and Core Web Vitals, checked in CI.',
	},
	{
		id: 'write-it-down',
		title: 'Write it down',
		body: 'Decision records and READMEs a new teammate can follow alone.',
	},
];

/** Old Services sub-sections: [section id, capability slug, internal label]. */
const capabilities = [
	['N8UUCQaHeHbhTnB1PIIaV', 'fullstack', 'Full-stack development'],
	['6ueaUp3zLyjWubJnielWiE', 'ai-systems', 'AI and ML systems'],
	['4JcJtmLfLw3tdGzteRDtF9', 'other', 'Other services'],
] as const;

export default async function run(client: Client): Promise<void> {
	await client.upsertEntry('seo-site', 'seo', {
		internalName: 'SEO — Site default',
		title: 'Nithin Pradeep — Senior Technical Consultant @ EY',
		description:
			'Senior Technical Consultant at EY in Bangalore, building AI agents, guardrails and MCP infrastructure for enterprise, plus full-stack products with Next.js, Node.js and Python.',
		noIndex: false,
	});

	for (const social of socials) {
		await client.upsertEntry(`link-${social.id}`, 'link', {
			internalName: `Link — ${social.label}`,
			label: social.label,
			url: social.url,
			icon: social.id,
			openInNewTab: true,
		});
	}
	for (const channel of contactChannels) {
		await client.upsertEntry(`link-contact-${channel.id}`, 'link', {
			internalName: `Link — Contact ${channel.label}`,
			label: channel.label,
			detail: channel.detail,
			url: channel.url,
			icon: channel.id,
			openInNewTab: channel.newTab,
		});
	}

	await client.upsertEntry('siteSettings', 'siteSettings', {
		internalName: 'Site — Nithin Pradeep',
		name: 'Nithin Pradeep',
		role: 'Senior Technical Consultant',
		company: 'EY',
		city: 'Bangalore',
		region: 'Karnataka',
		countryCode: 'IN',
		timeZone: 'Asia/Kolkata',
		isAvailable: true,
		availabilityLabel: 'Available for new projects',
		email: 'nithinp150@gmail.com',
		socials: socials.map((social) => link(`link-${social.id}`, 'Entry')),
		contactChannels: contactChannels.map((channel) =>
			link(`link-contact-${channel.id}`, 'Entry')
		),
		knowsAbout: [
			'AI Agents',
			'Model Context Protocol (MCP)',
			'Retrieval-Augmented Generation (RAG)',
			'LLM Guardrails',
			'React',
			'Next.js',
			'TypeScript',
			'Node.js',
			'Python',
			'Full Stack Development',
		],
		seo: link('seo-site', 'Entry'),
		twitterHandle: '@_nithiin7',
	});

	for (const principle of principles) {
		await client.upsertEntry(`principle-${principle.id}`, 'principle', {
			internalName: `Principle — ${principle.title}`,
			title: principle.title,
			body: principle.body,
		});
	}

	await client.upsertEntry('stat-concurrent-users', 'stat', {
		internalName: 'Stat — Concurrent users served',
		value: 1_000_000,
		suffix: '+',
		label: 'Concurrent users served',
		isCompact: true,
	});

	for (const [sectionId, slug, label] of capabilities) {
		const section = await client.getEntry(sectionId);
		const [titleLink, listLink] =
			value<{ sys: { id: string } }[]>(section, 'contents') ?? [];
		const heading = await client.getEntry(titleLink.sys.id);
		const list = await client.getEntry(listLink.sys.id);
		await client.upsertEntry(`capability-${slug}`, 'capability', {
			internalName: `Capability — ${label}`,
			title: value<string>(heading, 'title'),
			summary: value<string>(heading, 'subTitle'),
			items: value<string[]>(list, 'list'),
		});
	}
}
