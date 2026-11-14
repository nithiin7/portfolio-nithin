import { httpsUrl } from 'helpers/format';
import type { Company } from 'types/company';
import type { RawCompany } from 'types/contentful';

/** Converts a Contentful company to a Company. */
export const toCompany = (raw: RawCompany): Company => {
	const width = raw.logo?.width ?? 1;
	const height = raw.logo?.height ?? 1;
	return {
		name: raw.name,
		slug: raw.slug,
		logoUrl: raw.logo?.url ? httpsUrl(raw.logo.url) : undefined,
		ratio: width > 0 && height > 0 ? width / height : 1,
		showLogo: raw.showLogo ?? true,
		url: raw.websiteUrl ?? undefined,
	};
};

/** Whether the company has a logo to render. */
export const showsLogo = (company: Company): boolean =>
	company.showLogo && Boolean(company.logoUrl);
