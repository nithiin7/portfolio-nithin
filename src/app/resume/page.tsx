import type { Metadata } from 'next';

import Resume from 'components/pages/resume/Resume/Resume';
import JsonLd from 'components/utilities/JsonLd/JsonLd';
import { absoluteUrl, personJsonLd, siteName } from 'config/site';
import { loadHome, loadPageSeo, loadSiteSettings } from 'helpers/contentful';
import type { Seo, SiteSettings } from 'types/site';

export const revalidate = 3600;

const url = absoluteUrl('/resume');

/** Page "resume" SEO from Contentful, or one built from Site Settings. */
const resumeSeo = async (): Promise<[Seo, SiteSettings]> => {
	const [seo, site] = await Promise.all([
		loadPageSeo('resume'),
		loadSiteSettings(),
	]);
	return [
		seo ?? {
			title: 'Résumé',
			description: `${site.role} at ${site.company}: experience, skills and certifications. Read online or download the PDF.`,
		},
		site,
	];
};

export async function generateMetadata(): Promise<Metadata> {
	const [{ title, description }, site] = await resumeSeo();
	const ogTitle = `${title} | ${site.name}`;

	return {
		title,
		description,
		openGraph: {
			type: 'profile',
			locale: 'en_US',
			url,
			title: ogTitle,
			description,
			siteName: siteName(site),
		},
		twitter: {
			card: 'summary_large_image',
			title: ogTitle,
			description,
			creator: site.twitterHandle,
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
		alternates: { canonical: url },
	};
}

export default async function ResumePage() {
	const [home, site] = await Promise.all([loadHome(), loadSiteSettings()]);

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		dateModified: new Date().toISOString(),
		mainEntity: personJsonLd(site),
	};

	return (
		<>
			<JsonLd id="resume-structured-data" data={structuredData} />
			<Resume
				site={site}
				bio={home.about.bio}
				capabilities={home.capabilities.items}
				experiences={home.career.experiences}
				certifications={home.certifications.items}
				resumeUrl="/resume.pdf"
			/>
		</>
	);
}
