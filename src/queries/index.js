import { gql } from '@apollo/client';

export const HOME_PAGE = gql`
	query Home {
		pageCollection(where: { name: "home" }, limit: 1) {
			items {
				name
				title
				slug
				ogtitle
				ogurl
				description
			}
		}
	}
`;
