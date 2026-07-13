import { convertContentfulBlogPost, loadBlogPosts } from 'helpers/contentful';

const baseUrl = 'https://portfolio-nithin.vercel.app';

const escapeXml = (str: string): string =>
	str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');

export async function GET(): Promise<Response> {
	const { data } = await loadBlogPosts(100, 0);
	const posts =
		data?.blogPostCollection?.items?.map(convertContentfulBlogPost) ?? [];

	const items = posts
		.map(
			(post) => `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${baseUrl}/blog/${post.slug}</link>
			<guid>${baseUrl}/blog/${post.slug}</guid>
			<description>${escapeXml(post.excerpt)}</description>
			<pubDate>${new Date(post.publishedDate).toUTCString()}</pubDate>
		</item>`
		)
		.join('');

	const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Nithin Pradeep — Blog</title>
		<link>${baseUrl}/blog</link>
		<description>Articles by Nithin Pradeep, Full Stack Developer</description>
		<language>en</language>
		<atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />${items}
	</channel>
</rss>`;

	return new Response(feed, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 's-maxage=3600, stale-while-revalidate',
		},
	});
}
