import dynamic from 'next/dynamic';

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
