const url = 'https://portfolio-nithin.vercel.app';

export const siteConfig = {
	name: 'Nithin Pradeep',
	shortName: 'Nithin Pradeep',
	siteName: 'Nithin Pradeep — Portfolio',
	role: 'Senior Technical Consultant',
	company: 'EY',
	location: {
		city: 'Bangalore',
		region: 'Karnataka',
		country: 'IN',
		timeZone: 'Asia/Kolkata',
	},
	availability: {
		open: true,
		label: 'Available for new projects',
	},
	url,
	title: 'Nithin Pradeep — Senior Technical Consultant @ EY',
	titleTemplate: '%s | Nithin Pradeep',
	description:
		'Senior Technical Consultant at EY in Bangalore, building AI agents, guardrails and MCP infrastructure for enterprise, plus full-stack products with Next.js, Node.js and Python.',
	ogImage: {
		url: '/opengraph-image.jpeg',
		width: 1200,
		height: 630,
		alt: 'Nithin Pradeep — Senior Technical Consultant @ EY',
	},
	twitterHandle: '@_nithiin7',
	socials: {
		github: 'https://github.com/nithiin7',
		linkedin: 'https://www.linkedin.com/in/nithin-p7/',
		instagram: 'https://www.instagram.com/__nithiin__/',
		twitter: 'https://twitter.com/_nithiin7',
		credly: 'https://www.credly.com/users/nithin-pradeep.53925824',
	},
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
	rssUrl: `${url}/feed.xml`,
	googleSiteVerification: 'google6eac2553ee959d3e',
} as const;

export const absoluteUrl = (path = '/'): string =>
	new URL(path, siteConfig.url).toString();

export const personJsonLd = {
	'@type': 'Person',
	name: siteConfig.name,
	url: absoluteUrl(),
	image: absoluteUrl(siteConfig.ogImage.url),
	jobTitle: siteConfig.role,
	worksFor: { '@type': 'Organization', name: siteConfig.company },
	address: {
		'@type': 'PostalAddress',
		addressLocality: siteConfig.location.city,
		addressRegion: siteConfig.location.region,
		addressCountry: siteConfig.location.country,
	},
	sameAs: Object.values(siteConfig.socials),
	knowsAbout: [...siteConfig.knowsAbout],
} as const;
