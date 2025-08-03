import { loadBlogPosts, convertContentfulBlogPost } from 'helpers/contentful';
import type { BlogPost } from 'types/blog';

interface BlogPageServerProps {
	searchParams: Promise<{
		page?: string;
		limit?: string;
		category?: string;
		tag?: string;
		search?: string;
	}>;
}

export default async function BlogPageServer({
	searchParams,
}: Readonly<BlogPageServerProps>) {
	const params = await searchParams;
	const page = parseInt(params.page || '1', 10);
	const limit = parseInt(params.limit || '12', 10);
	const skip = (page - 1) * limit;

	const { data } = await loadBlogPosts(limit, skip);
	const posts = data.blogPostCollection.items.map(convertContentfulBlogPost);
	const totalPosts = data.blogPostCollection.total;
	const totalPages = Math.ceil(totalPosts / limit);

	let filteredPosts = posts;

	if (params.category) {
		filteredPosts = filteredPosts.filter(
			(post: BlogPost) => post.category === params.category
		);
	}

	if (params.tag) {
		filteredPosts = filteredPosts.filter((post: BlogPost) =>
			post.tags.includes(params.tag!)
		);
	}

	if (params.search) {
		const searchTerm = params.search.toLowerCase();
		filteredPosts = filteredPosts.filter(
			(post: BlogPost) =>
				post.title.toLowerCase().includes(searchTerm) ||
				post.excerpt.toLowerCase().includes(searchTerm) ||
				post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
		);
	}

	return {
		posts: filteredPosts,
		pagination: {
			currentPage: page,
			totalPages,
			totalPosts,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
		filters: {
			category: params.category,
			tag: params.tag,
			search: params.search,
		},
	};
}
