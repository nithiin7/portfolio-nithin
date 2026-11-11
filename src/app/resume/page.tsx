import type { Metadata } from 'next';
import Script from 'next/script';

import { Resume } from 'components/pages';
import { transformCareerData } from 'helpers/career';
import { loadData } from 'helpers/contentful';
import { getSection } from 'helpers/sections';
import type { Certification } from 'types/certification';

export const revalidate = 3600;

const title = 'Resume';
const ogTitle = 'Resume | Nithin Pradeep - Full Stack Developer';
const description =
	'Full Stack Developer resume for Nithin Pradeep — experience, skills, and certifications. View online or download the PDF.';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title,
		description,
		openGraph: {
			type: 'profile',
			locale: 'en_US',
			url: 'https://portfolio-nithin.vercel.app/resume',
			title: ogTitle,
			description,
			siteName: 'Nithin Pradeep - Portfolio',
			images: [
				{
					url: '/opengraph-image.jpeg',
					width: 1200,
					height: 630,
					alt: 'Nithin Pradeep - Full Stack Developer Resume',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: ogTitle,
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
			canonical: 'https://portfolio-nithin.vercel.app/resume',
		},
	};
}

const resumeStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'ProfilePage',
	dateModified: new Date().toISOString(),
	mainEntity: {
		'@type': 'Person',
		name: 'Nithin Pradeep',
		jobTitle: 'Full Stack Developer',
		url: 'https://portfolio-nithin.vercel.app/resume',
		sameAs: [
			'https://github.com/nithiin7',
			'https://www.linkedin.com/in/nithinpradeep/',
			'https://www.instagram.com/__nithiin__/',
			'https://www.twitter.com/_nithiin7/',
			'https://www.linkedin.com/in/nithin-p7/',
		],
	},
};

export default async function ResumePage() {
	const props = await loadData('home');
	const path = props?.data?.pageCollection?.items?.[0];

	const sections = path.sectionCollection?.items || [];

	const header = getSection(sections, 'header');
	const services = getSection(sections, 'services');
	const about = getSection(sections, 'about');
	const career = getSection(sections, 'career');
	const certifications = getSection(sections, 'certifications');

	const headerData = header.contentsCollection;
	const servicesData = {
		data: services.contentsCollection.items[0] || {},
		services: services.contentsCollection.items,
	};
	const aboutData = about.contentsCollection;
	const careerDataProps = transformCareerData({
		data: career.contentsCollection.items[0] || {},
		career: career.contentsCollection.items[1]?.contentsCollection?.items || [],
	});
	const certificationsData = {
		data: certifications.contentsCollection.items[0] || {},
		certifications: (certifications.contentsCollection.items[1]
			?.contentsCollection?.items || []) as unknown as Certification[],
	};

	return (
		<>
			<Script
				id="resume-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(resumeStructuredData),
				}}
			/>
			<Resume
				header={headerData}
				about={aboutData}
				services={servicesData}
				career={careerDataProps}
				certifications={certificationsData}
				resumeUrl="/resume.pdf"
			/>
		</>
	);
}
