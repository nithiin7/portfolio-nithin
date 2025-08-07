import {
	HomeAbout,
	HomeCareer,
	HomeCollaborations,
	HomeHeader,
	HomePortfolio,
	HomeServices,
	HomeTestimonial,
} from 'components/pages';
import { transformCareerData } from 'helpers/career';
import { loadData } from 'helpers/contentful';

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

	return (
		<>
			<HomeHeader data={headerData} />
			<HomeServices {...servicesData} />
			<HomePortfolio {...portfolioData} />
			<HomeAbout data={aboutData} />
			<HomeCareer {...careerDataProps} />
			<HomeCollaborations {...collaborationsData} />
			<HomeTestimonial {...testimonialData} />
		</>
	);
}
