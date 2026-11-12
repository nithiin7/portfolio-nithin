import dynamic from 'next/dynamic';
import Script from 'next/script';

import HomeAbout from 'components/pages/homepage/HomeAbout/HomeAbout';
import type { AboutStat } from 'components/pages/homepage/HomeAbout/HomeAbout';
import HomeCapabilities from 'components/pages/homepage/HomeCapabilities/HomeCapabilities';
import HomeHeader from 'components/pages/homepage/HomeHeader/HomeHeader';
import HomePortfolio from 'components/pages/homepage/HomePortfolio/HomePortfolio';
import { aboutContent } from 'config/about';
import { absoluteUrl, personJsonLd, siteConfig } from 'config/site';
import { transformCareerData, yearsOfExperience } from 'helpers/career';
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
	const certificationsData = {
		data: certifications.contentsCollection.items[0] || {},
		certifications: (certifications.contentsCollection.items[1]
			?.contentsCollection?.items || []) as unknown as Certification[],
	};
	const years = yearsOfExperience(
		careerDataProps.experiences.map((experience) => experience.duration)
	);
	const aboutStats: AboutStat[] = [
		...(years ? [{ value: years, suffix: '+', label: 'Years shipping' }] : []),
		{ value: portfolioData.portfolio.length, label: 'Projects shipped' },
		{
			value: certificationsData.certifications.length,
			label: 'Certifications',
		},
		{
			value: aboutContent.peakConcurrentUsers,
			compact: true,
			suffix: '+',
			label: 'Concurrent users served',
		},
	];
	const [aboutTitle, aboutPortrait] = about.contentsCollection.items as {
		title?: string;
		image?: { url?: string };
	}[];

	const testimonialData = {
		data: testimonials.contentsCollection.items[0] || {},
		testimonial:
			testimonials.contentsCollection.items[1]?.contentsCollection?.items || [],
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
			<HomePortfolio {...portfolioData} />
			<HomeAbout
				title={aboutTitle?.title}
				portraitUrl={aboutPortrait?.image?.url}
				stats={aboutStats}
			/>
			<HomeCapabilities {...servicesData} />
			<HomeCareer {...careerDataProps} />
			<HomeCertifications {...certificationsData} />
			<HomeCollaborations {...collaborationsData} />
			<HomeTestimonial {...testimonialData} />
		</>
	);
}
