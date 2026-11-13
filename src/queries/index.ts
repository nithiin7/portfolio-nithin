import { gql } from '@apollo/client';

import {
	ASSET_FIELDS,
	COMPANY_FIELDS,
	PROJECT_CARD_FIELDS,
	SEO_FIELDS,
} from './fragments';

export const GET_SITE_SETTINGS = gql`
	${SEO_FIELDS}
	query SiteSettings($preview: Boolean = false) {
		siteSettingsCollection(limit: 1, preview: $preview) {
			items {
				name
				role
				company
				city
				region
				countryCode
				timeZone
				isAvailable
				availabilityLabel
				email
				knowsAbout
				twitterHandle
				socialsCollection(limit: 10) {
					items {
						label
						url
						icon
					}
				}
				contactChannelsCollection(limit: 6) {
					items {
						label
						url
						detail
						icon
						openInNewTab
					}
				}
				seo {
					...SeoFields
				}
			}
		}
	}
`;

/**
 * Every homepage section, typed by `key`. Keep the item limits tight: the
 * query sits under Contentful's 11 000 complexity cap only because each
 * collection is bounded (check with header X-Contentful-Graphql-Query-Cost).
 */
export const GET_HOME = gql`
	${ASSET_FIELDS}
	${COMPANY_FIELDS}
	${PROJECT_CARD_FIELDS}
	query Home($preview: Boolean = false) {
		pageCollection(where: { slug: "home" }, limit: 1, preview: $preview) {
			items {
				sectionCollection(limit: 9) {
					items {
						key
						heading
						lede
						words
						body {
							json
						}
						image {
							...AssetFields
						}
						itemsCollection(limit: 20) {
							items {
								__typename
								... on PortfolioDetails {
									...ProjectCardFields
								}
								... on Capability {
									title
									summary
									items
								}
								... on CareerExperience {
									sys {
										id
									}
									title
									companyName: company
									employer {
										...CompanyFields
									}
									location
									type
									startDate
									endDate
									description
									techStack
								}
								... on Certification {
									sys {
										id
									}
									name
									slug: id
									provider
									providerLogo {
										url
									}
									certificateUrl
									credentialId
									issuedOn
									expiresOn
									highlight
								}
								... on TestimonialCard {
									sys {
										id
									}
									review
									reviewer
									authorRole
									organisation
									company {
										...CompanyFields
									}
									avatar {
										url
									}
								}
								... on Company {
									...CompanyFields
								}
								... on Principle {
									title
									body
								}
								... on Link {
									label
									url
									logo {
										url
										width
										height
									}
								}
							}
						}
						statsCollection(limit: 4) {
							items {
								value
								suffix
								label
								isCompact
							}
						}
						ctasCollection(limit: 2) {
							items {
								label
								url
								openInNewTab
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_PAGE_SEO = gql`
	${SEO_FIELDS}
	query PageSeo($slug: String!, $preview: Boolean = false) {
		pageCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
			items {
				seo {
					...SeoFields
				}
			}
		}
	}
`;

const BLOG_POST_SUMMARY = gql`
	${SEO_FIELDS}
	fragment BlogPostSummary on BlogPost {
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
		blogCategory {
			name
		}
		tags
		author {
			name
			avatar {
				url
				title
				description
			}
		}
		publishedDate
		updatedDate
		readTime
		seo {
			...SeoFields
		}
	}
`;

export const GET_ALL_BLOG_POSTS = gql`
	${BLOG_POST_SUMMARY}
	query GetAllBlogPosts(
		$limit: Int = 10
		$skip: Int = 0
		$preview: Boolean = false
	) {
		blogPostCollection(
			limit: $limit
			skip: $skip
			order: [publishedDate_DESC]
			preview: $preview
		) {
			total
			items {
				...BlogPostSummary
			}
		}
	}
`;

export const GET_BLOG_POST_BY_SLUG = gql`
	${BLOG_POST_SUMMARY}
	query GetBlogPostBySlug($slug: String!, $preview: Boolean = false) {
		blogPostCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
			items {
				...BlogPostSummary
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
			}
		}
	}
`;
