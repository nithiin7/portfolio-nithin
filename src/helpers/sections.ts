import type { SectionItem } from 'types/contentful';

/**
 * Homepage sections keyed by the Contentful `Section.name` field (the only
 * stable identifier on the Section content type — it has no slug).
 * Reordering sections in the CMS is safe; renaming one requires updating
 * this map.
 */
export const HOME_SECTIONS = {
	header: 'Home - Header',
	services: 'Home - Services',
	about: 'Home - About',
	portfolio: 'Home - Portfolio',
	collaborations: 'Home - Collaborations',
	testimonials: 'Home - Testimonials',
	career: 'Home - Careers',
	certifications: 'Home - Certifications',
} as const;

export type HomeSectionKey = keyof typeof HOME_SECTIONS;

const normalize = (name: string): string => name.trim().toLowerCase();

const emptySection = (name: string): SectionItem => ({
	__typename: 'Section',
	name,
	contentsCollection: { __typename: 'SectionContentsCollection', items: [] },
});

export const getSection = (
	sections: readonly SectionItem[],
	key: HomeSectionKey
): SectionItem => {
	const name = HOME_SECTIONS[key];
	const match = sections.find(
		(section) => section?.name && normalize(section.name) === normalize(name)
	);

	if (match) return match;

	console.warn(
		`[getSection] Contentful section "${name}" (${key}) not found; rendering it empty.`
	);
	return emptySection(name);
};
