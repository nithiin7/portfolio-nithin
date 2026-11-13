import { httpsUrl } from 'helpers/format';
import type { Company } from 'types/company';
import type { RawCompany } from 'types/contentful';

/** Contentful Company → app Company (logo URL made absolute, ratio from the asset). */
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

/** True when the company's mark is drawn (not replaced by its name). */
export const showsLogo = (company: Company): boolean =>
	company.showLogo && Boolean(company.logoUrl);
