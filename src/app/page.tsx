import dynamic from 'next/dynamic';
import type { ReactElement } from 'react';

import HomeAbout from 'components/pages/homepage/HomeAbout/HomeAbout';
import type { AboutStat } from 'components/pages/homepage/HomeAbout/HomeAbout';
import HomeCapabilities from 'components/pages/homepage/HomeCapabilities/HomeCapabilities';
import HomeHeader from 'components/pages/homepage/HomeHeader/HomeHeader';
import HomeManifesto from 'components/pages/homepage/HomeManifesto/HomeManifesto';
import HomePortfolio from 'components/pages/homepage/HomePortfolio/HomePortfolio';
import JsonLd from 'components/utilities/JsonLd/JsonLd';
import { absoluteUrl, personJsonLd, siteName } from 'config/site';
import { yearsOfExperience } from 'helpers/career';
import { loadHome, loadSiteSettings } from 'helpers/contentful';
import { enrichPortfolio } from 'helpers/portfolio';
import type { HomeSectionKey } from 'types/home';

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

/** Home route, rendering sections in the order Contentful lists them. */
export default async function Home() {
	const [home, site] = await Promise.all([loadHome(), loadSiteSettings()]);
	const projects = await enrichPortfolio(home.work.projects);
	const { career, certifications } = home;

	const years = yearsOfExperience(
		career.experiences.map((experience) => experience.startDate)
	);
	const aboutStats: AboutStat[] = [
		...(years ? [{ value: years, suffix: '+', label: 'Years shipping' }] : []),
		{ value: certifications.items.length, label: 'Certifications' },
		...home.about.stats,
	];

	const sections: Record<HomeSectionKey, ReactElement | null> = {
		hero: (
			<HomeHeader
				key="hero"
				site={site}
				pitch={home.hero.pitch}
				ctas={home.hero.ctas}
			/>
		),
		manifesto: home.manifesto ? (
			<HomeManifesto key="manifesto" manifesto={home.manifesto} />
		) : null,
		work: (
			<HomePortfolio
				key="work"
				data={{ title: home.work.heading }}
				portfolio={projects}
			/>
		),
		about: (
			<HomeAbout
				key="about"
				title={home.about.heading}
				bio={home.about.bio}
				portrait={home.about.portrait}
				principles={home.about.principles}
				stats={aboutStats}
			/>
		),
		capabilities: (
			<HomeCapabilities
				key="capabilities"
				data={{
					title: home.capabilities.heading,
					subTitle: home.capabilities.lede,
				}}
				capabilities={home.capabilities.items}
			/>
		),
		career: (
			<HomeCareer
				key="career"
				data={{ title: career.heading, subtitle: career.lede }}
				experiences={career.experiences}
			/>
		),
		certifications: (
			<HomeCertifications
				key="certifications"
				data={{ title: certifications.heading, subtitle: certifications.lede }}
				certifications={certifications.items}
			/>
		),
		collaborations: (
			<HomeCollaborations
				key="collaborations"
				data={{ title: home.collaborations.heading }}
				collaborators={home.collaborations.items}
			/>
		),
		testimonials: (
			<HomeTestimonial
				key="testimonials"
				data={{ title: home.testimonials.heading }}
				testimonial={home.testimonials.items}
			/>
		),
	};

	const order: HomeSectionKey[] = [
		'hero',
		...home.order.filter((key) => key !== 'hero'),
	];

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: siteName(site),
		url: absoluteUrl(),
		description: site.seo.description,
		author: personJsonLd(site),
	};

	return (
		<>
			<JsonLd id="home-structured-data" data={structuredData} />
			{order.map((key) => sections[key])}
		</>
	);
}
