import dynamic from 'next/dynamic';
import Script from 'next/script';

import {
	HomeAbout,
	HomeHeader,
	HomePortfolio,
	HomeServices,
} from 'components/pages';
import { absoluteUrl, personJsonLd, siteConfig } from 'config/site';
import { transformCareerData } from 'helpers/career';
import { loadData, loadPortfolioSummaries } from 'helpers/contentful';
import { enrichPortfolio } from 'helpers/portfolio';
import { getSection } from 'helpers/sections';
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

const homeStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: siteConfig.siteName,
	url: absoluteUrl(),
	description: siteConfig.description,
	author: personJsonLd,
};

export default async function Home() {
	const [props, portfolioSummaries] = await Promise.all([
		loadData('home'),
		loadPortfolioSummaries(),
	]);
	const path = props?.data?.pageCollection?.items?.[0];

	const sections = path.sectionCollection?.items || [];

	const services = getSection(sections, 'services');
	const about = getSection(sections, 'about');
	const portfolio = getSection(sections, 'portfolio');
	const career = getSection(sections, 'career');
	const collaborations = getSection(sections, 'collaborations');
	const testimonials = getSection(sections, 'testimonials');
	const certifications = getSection(sections, 'certifications');

	const servicesData = {
		data: services.contentsCollection.items[0] || {},
		services: services.contentsCollection.items,
	};
	const aboutData = about.contentsCollection;
	const portfolioData = {
		data: portfolio.contentsCollection.items[0] || {},
		portfolio: await enrichPortfolio(
			portfolio.contentsCollection.items[1]?.contentsCollection?.items || [],
			portfolioSummaries
		),
	};
	const careerDataProps = transformCareerData({
		data: career.contentsCollection.items[0] || {},
		career: career.contentsCollection.items[1]?.contentsCollection?.items || [],
	});
	const collaborationsData = {
		data: collaborations.contentsCollection.items[0] || {},
	};
	const testimonialData = {
		data: testimonials.contentsCollection.items[0] || {},
		testimonial:
			testimonials.contentsCollection.items[1]?.contentsCollection?.items || [],
	};
	const certificationsData = {
		data: certifications.contentsCollection.items[0] || {},
		certifications: (certifications.contentsCollection.items[1]
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
			<HomeHeader />
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
