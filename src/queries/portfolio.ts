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
				year
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

export const GET_PORTFOLIO_SUMMARIES = gql`
	query GetPortfolioSummaries {
		portfolioDetailsCollection(limit: 100) {
			items {
				id
				shortDescription
			}
		}
	}
`;

/** Card order of the homepage works section, which "Next project" follows. */
export const GET_WORKS_ORDER = gql`
	query GetWorksOrder($name: String!) {
		sectionCollection(where: { name: $name }, limit: 1) {
			items {
				contentsCollection(limit: 5) {
					items {
						... on Section {
							contentsCollection(limit: 100) {
								items {
									... on PortfolioCard {
										id
										title
										image {
											url
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;
