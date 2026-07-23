import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Script from 'next/script';

import {
	HomeAbout,
	HomeHeader,
	HomePortfolio,
	HomeServices,
} from 'components/pages';
import { transformCareerData } from 'helpers/career';
import { loadData } from 'helpers/contentful';
import type { Certification } from 'types/certification';

export const revalidate = 3600;

const HomeCareer = dynamic(
	() => import('components/pages/homepage/HomeCareer/HomeCareer')
);
const HomeCertifications = dynamic(
	() =>
		import('components/pages/homepage/HomeCertifications/HomeCertifications')
);
const HomeCollaborations = dynamic(
	() =>
		import('components/pages/homepage/HomeCollaborations/HomeCollaborations')
);
const HomeTestimonial = dynamic(
	() => import('components/pages/homepage/HomeTestimonial/HomeTestimonial')
);

const defaultTitle =
	'Nithin Pradeep - AI Innovator & Software Engineer | Building Intelligent Digital Experiences';
const defaultDescription =
	'AI innovator, full-stack developer, and automation engineer. Engineer of intelligent solutions using Next.js, Node.js, Docker, n8n, and AI/ML platforms.';

export async function generateMetadata(): Promise<Metadata> {
	const props = await loadData('home');
	const path = props?.data?.pageCollection?.items?.[0];

	const title = path?.title || defaultTitle;
	const description = path?.description || defaultDescription;

	return {
		title,
		description,
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url: 'https://portfolio-nithin.vercel.app/',
			title,
			description,
			siteName: 'Nithin Pradeep - Portfolio',
			images: [
				{
					url: '/opengraph-image.jpeg',
					width: 1200,
					height: 630,
					alt: 'Nithin Pradeep - Full Stack Developer Portfolio',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			creator: '@nithiin7',
			images: ['/opengraph-image.jpeg'],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		alternates: {
			canonical: 'https://portfolio-nithin.vercel.app/',
		},
	};
}

const homeStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: 'Nithin Pradeep - Portfolio',
	url: 'https://portfolio-nithin.vercel.app/',
	description: defaultDescription,
	author: {
		'@type': 'Person',
		name: 'Nithin Pradeep',
		jobTitle: 'Full Stack Developer',
		url: 'https://portfolio-nithin.vercel.app/',
		sameAs: [
			'https://github.com/nithiin7',
			'https://www.linkedin.com/in/nithinpradeep/',
			'https://www.instagram.com/__nithiin__/',
			'https://www.twitter.com/_nithiin7/',
			'https://www.linkedin.com/in/nithin-p7/',
		],
	},
};

export default async function Home() {
	const props = await loadData('home');
	const path = props?.data?.pageCollection?.items?.[0];

	const sections = path.sectionCollection?.items || [];

	const headerData = sections[0]?.contentsCollection || { items: [] };
	const servicesData = {
		data: sections[1]?.contentsCollection?.items?.[0] || {},
		services: sections[1]?.contentsCollection?.items || [],
	};
	const aboutData = sections[2]?.contentsCollection || { items: [] };
	const portfolioData = {
		data: sections[3]?.contentsCollection?.items?.[0] || {},
		portfolio:
			sections[3]?.contentsCollection?.items?.[1]?.contentsCollection?.items ||
			[],
	};
	const careerDataProps = transformCareerData({
		data: sections[6]?.contentsCollection?.items?.[0] || {},
		career:
			sections[6]?.contentsCollection?.items?.[1]?.contentsCollection?.items ||
			[],
	});
	const collaborationsData = {
		data: sections[4]?.contentsCollection?.items?.[0] || {},
	};
	const testimonialData = {
		data: sections[5]?.contentsCollection?.items?.[0] || {},
		testimonial:
			sections[5]?.contentsCollection?.items?.[1]?.contentsCollection?.items ||
			[],
	};
	const certificationsData = {
		data: sections[7]?.contentsCollection?.items?.[0] || {},
		certifications: (sections[7]?.contentsCollection?.items?.[1]
			?.contentsCollection?.items || []) as unknown as Certification[],
	};

	return (
		<>
			<Script
				id="home-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(homeStructuredData),
				}}
			/>
			<HomeHeader data={headerData} />
			<HomeServices {...servicesData} />
			<HomePortfolio {...portfolioData} />
			<HomeAbout data={aboutData} />
			<HomeCareer {...careerDataProps} />
			<HomeCertifications {...certificationsData} />
			<HomeCollaborations {...collaborationsData} />
			<HomeTestimonial {...testimonialData} />
		</>
	);
}
