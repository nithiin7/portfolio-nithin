import { gql } from '@apollo/client';

export const ASSET_FIELDS = gql`
	fragment AssetFields on Asset {
		url
		title
		description
		width
		height
		contentType
	}
`;

export const SEO_FIELDS = gql`
	fragment SeoFields on Seo {
		title
		description
		noIndex
		ogImage {
			url
		}
	}
`;

export const PROJECT_CARD_FIELDS = gql`
	${ASSET_FIELDS}
	fragment ProjectCardFields on PortfolioDetails {
		sys {
			id
		}
		id
		slug
		title
		shortDescription
		year
		role
		tech
		techHighlights
		demo
		github
		spotlightImage {
			...AssetFields
		}
		spotlightImageDark {
			...AssetFields
		}
	}
`;

export const COMPANY_FIELDS = gql`
	fragment CompanyFields on Company {
		name
		slug
		websiteUrl
		showLogo
		logo {
			url
			width
			height
		}
	}
`;
