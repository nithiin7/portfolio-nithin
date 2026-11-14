import { gql } from '@apollo/client';

import { ASSET_FIELDS, PROJECT_CARD_FIELDS, SEO_FIELDS } from './fragments';

export const GET_PROJECT = gql`
	${ASSET_FIELDS}
	${PROJECT_CARD_FIELDS}
	${SEO_FIELDS}
	query Project($slug: String!, $preview: Boolean = false) {
		portfolioDetailsCollection(
			where: { slug: $slug }
			limit: 1
			preview: $preview
		) {
			items {
				...ProjectCardFields
				description {
					json
					links {
						assets {
							block {
								sys {
									id
								}
								url
								title
								description
								width
								height
								contentType
							}
						}
					}
				}
				galleryCollection(limit: 12) {
					items {
						...AssetFields
					}
				}
				features
				seo {
					...SeoFields
				}
			}
		}
	}
`;

export const GET_PROJECT_SLUG_BY_LEGACY_ID = gql`
	query ProjectSlugByLegacyId($id: Int!, $preview: Boolean = false) {
		portfolioDetailsCollection(
			where: { id: $id }
			limit: 1
			preview: $preview
		) {
			items {
				slug
			}
		}
	}
`;

export const GET_WORK = gql`
	${PROJECT_CARD_FIELDS}
	query Work($preview: Boolean = false) {
		sectionCollection(where: { key: "work" }, limit: 1, preview: $preview) {
			items {
				itemsCollection(limit: 30) {
					items {
						... on PortfolioDetails {
							...ProjectCardFields
						}
					}
				}
			}
		}
	}
`;
