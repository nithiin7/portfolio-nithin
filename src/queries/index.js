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
									... on ExperienceCard {
										name
										title
										contentsCollection {
											items {
												... on ImageCard {
													name
													title
													description
												}
											}
										}
									}
									... on Section {
										name
										contentsCollection(limit: 10) {
											items {
												... on Title {
													name
													title
													subTitle
												}
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
												... on PortfolioCard {
													name
													id
													image {
														url
													}
													title
													gitHub
													demo
												}
												... on TestimonialCard {
													name
													avatar {
														url
													}
													reviewer
													institution
													review
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
