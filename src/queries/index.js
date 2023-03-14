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
				sectionCollection(limit: 10) {
					items {
						... on Section {
							name
							contentsCollection(limit: 10) {
								items {
									... on Title {
										title
										subTitle
									}
									... on ImageCard {
										image {
											title
											url
										}
									}
									... on Section {
										name
										contentsCollection(limit: 10) {
											items {
												... on List {
													name
													list
												}
												... on Url {
													name
													url
													title
												}
												... on ImageCard {
													name
													image {
														title
														url
													}
												}
												... on AboutCard {
													name
													icon {
														url
													}
													title
													description
													duration
												}
											}
										}
									}
									... on Description {
										name
										descriptionLong {
											json
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
