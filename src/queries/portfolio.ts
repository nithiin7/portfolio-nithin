import { gql } from '@apollo/client';

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
				keywords
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
