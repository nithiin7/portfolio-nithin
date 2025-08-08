import { gql } from '@apollo/client';

/**
 * Query to get a page by slug
 * @param page - The slug of the page to get
 * @returns The page data
 */
export const GET_PAGE = gql`
	query Home($page: String!) {
		pageCollection(where: { slug: $page }, limit: 1) {
			items {
				name
				title
				slug
				ogtitle
				ogurl
				keywords
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
												... on PortfolioCard {
													name
													id
													image {
														url
													}
													title
													gitHub
													demo
													tech
													year
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
												... on CareerExperience {
													sys {
														id
													}
													title
													company
													year
													duration
													location
													type
													description
													technologies
													order
												}
											}
										}
									}
									... on Description {
										name
										descriptionShort
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

/**
 * Query to get all blog posts
 * @param limit - The limit of the blog posts to get
 * @param skip - The skip of the blog posts to get
 * @returns The blog posts data
 */
export const GET_ALL_BLOG_POSTS = gql`
	query GetAllBlogPosts($limit: Int = 10, $skip: Int = 0) {
		blogPostCollection(
			limit: $limit
			skip: $skip
			order: [publishedDate_DESC]
		) {
			total
			items {
				sys {
					id
				}
				title
				slug
				excerpt
				featuredImage {
					url
					title
					description
				}
				category
				tags
				authorName
				authorAvatar {
					url
					title
				}
				publishedDate
				updatedDate
				readTime
				seoTitle
				seoDescription
				seoKeywords
			}
		}
	}
`;

/**
 * Query to get a blog post by slug
 * @param slug - The slug of the blog post to get
 * @returns The blog post data
 */
export const GET_BLOG_POST_BY_SLUG = gql`
	query GetBlogPostBySlug($slug: String!) {
		blogPostCollection(where: { slug: $slug }, limit: 1) {
			items {
				sys {
					id
				}
				title
				slug
				excerpt
				content {
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
							}
						}
					}
				}
				featuredImage {
					url
					title
					description
				}
				category
				tags
				authorName
				authorAvatar {
					url
					title
				}
				publishedDate
				updatedDate
				readTime
				seoTitle
				seoDescription
				seoKeywords
			}
		}
	}
`;

/**
 * Query to get all blog categories
 * @returns The blog categories data
 */
export const GET_BLOG_CATEGORIES = gql`
	query GetBlogCategories {
		blogCategoryCollection(order: [name_ASC]) {
			items {
				sys {
					id
				}
				name
				slug
				description
			}
		}
	}
`;

/**
 * Query to get all blog tags
 * @returns The blog tags data
 */
export const GET_BLOG_TAGS = gql`
	query GetBlogTags {
		blogTagCollection(order: [name_ASC]) {
			items {
				sys {
					id
				}
				name
				slug
			}
		}
	}
`;

/**
 * Query to get all blog posts by category
 * @param category - The category of the blog posts to get
 * @param limit - The limit of the blog posts to get
 * @param skip - The skip of the blog posts to get
 * @returns The blog posts data
 */
export const GET_BLOG_POSTS_BY_CATEGORY = gql`
	query GetBlogPostsByCategory(
		$category: String!
		$limit: Int = 10
		$skip: Int = 0
	) {
		blogPostCollection(
			where: { category: $category }
			limit: $limit
			skip: $skip
			order: [publishedDate_DESC]
		) {
			total
			items {
				sys {
					id
				}
				title
				slug
				excerpt
				featuredImage {
					url
					title
					description
				}
				category
				tags
				authorName
				authorAvatar {
					url
					title
				}
				publishedDate
				updatedDate
				readTime
			}
		}
	}
`;

/**
 * Query to get all blog posts by tag
 * @param tag - The tag of the blog posts to get
 * @param limit - The limit of the blog posts to get
 * @param skip - The skip of the blog posts to get
 * @returns The blog posts data
 */
export const GET_BLOG_POSTS_BY_TAG = gql`
	query GetBlogPostsByTag($tag: String!, $limit: Int = 10, $skip: Int = 0) {
		blogPostCollection(
			where: { tags_contains_some: [$tag] }
			limit: $limit
			skip: $skip
			order: [publishedDate_DESC]
		) {
			total
			items {
				sys {
					id
				}
				title
				slug
				excerpt
				featuredImage {
					url
					title
					description
				}
				category
				tags
				authorName
				authorAvatar {
					url
					title
				}
				publishedDate
				updatedDate
				readTime
			}
		}
	}
`;
