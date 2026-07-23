import { gql } from '@apollo/client';

/**
 * Query to get a portfolio by id
 * @param id - The id of the portfolio to get
 * @returns The portfolio data
 */
export const GET_ALL_PORTFOLIO_IDS = gql`
	query GetAllPortfolioIds {
		portfolioDetailsCollection(limit: 100) {
			items {
				id
			}
		}
	}
`;

/**
 * Query to get id + title for every portfolio item, for search/command palette use
 * @returns The portfolio search items data
 */
export const GET_ALL_PORTFOLIO_TITLES = gql`
	query GetAllPortfolioTitles {
		portfolioDetailsCollection(limit: 100) {
			items {
				id
				title
			}
		}
	}
`;

export const GET_PORTFOLIO = gql`
	query Portfolio($id: Int!) {
		portfolioDetailsCollection(where: { id: $id }, limit: 1) {
			items {
				name
				slug
				id
				title
				description {
					json
				}
				shortDescription
				demo
				github
				spotlightImage {
					url
				}
				galleryCollection {
					items {
						description
						url
					}
				}
				features
				tech
			}
		}
	}
`;
