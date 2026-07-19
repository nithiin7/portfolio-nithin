import { ImageResponse } from 'next/og';

import {
	loadBlogPostBySlug,
	convertContentfulBlogPost,
} from 'helpers/contentful';

export const alt = 'Blog post - Nithin Pradeep';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadGoogleFont(
	family: string,
	weight: number,
	text: string
): Promise<ArrayBuffer> {
	const css = await (
		await fetch(
			`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
			{
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
				},
			}
		)
	).text();
	const resource = css.match(
		/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/
	);

	if (!resource) {
		throw new Error(`Failed to resolve font: ${family} ${weight}`);
	}

	return (await fetch(resource[1])).arrayBuffer();
}

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<ImageResponse> {
	const { slug } = await params;
	const { data } = await loadBlogPostBySlug(slug);
	const item = data?.blogPostCollection?.items?.[0];
	const post = item ? convertContentfulBlogPost(item) : null;

	const title = post?.title ?? 'Blog';
	const category = post?.category ?? '';
	const readTime = post?.readTime ? `${post.readTime} min read` : '';
	const author = post?.authorName ?? 'Nithin Pradeep';

	const titleSize = title.length > 80 ? 52 : title.length > 50 ? 62 : 76;
	const metaText = `${category}${readTime}${author}portfolio-nithin.vercel.app/blog·`;

	const [grotesk, roboto] = await Promise.all([
		loadGoogleFont('Familjen+Grotesk', 700, title),
		loadGoogleFont('Roboto', 400, metaText),
	]);

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				backgroundColor: 'rgb(8, 8, 7)',
				borderLeft: '14px solid #ff5722',
				padding: '64px 72px',
				fontFamily: 'Roboto',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					fontSize: 26,
					color: 'rgb(162, 158, 154)',
				}}
			>
				<div
					style={{
						width: 14,
						height: 14,
						borderRadius: '50%',
						backgroundColor: '#ff5722',
					}}
				/>
				portfolio-nithin.vercel.app/blog
			</div>

			<div
				style={{
					display: 'flex',
					fontFamily: 'Familjen Grotesk',
					fontSize: titleSize,
					fontWeight: 700,
					lineHeight: 1.15,
					color: 'rgb(232, 232, 227)',
					maxWidth: 1000,
				}}
			>
				{title}
			</div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					fontSize: 26,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
					{category && (
						<div
							style={{
								display: 'flex',
								backgroundColor: '#333',
								color: '#ccc',
								padding: '10px 24px',
								borderRadius: 999,
							}}
						>
							{category}
						</div>
					)}
					{readTime && (
						<div style={{ display: 'flex', color: 'rgb(162, 158, 154)' }}>
							{readTime}
						</div>
					)}
				</div>
				<div style={{ display: 'flex', color: 'rgb(232, 232, 227)' }}>
					{author}
				</div>
			</div>
		</div>,
		{
			...size,
			fonts: [
				{ name: 'Familjen Grotesk', data: grotesk, weight: 700 },
				{ name: 'Roboto', data: roboto, weight: 400 },
			],
		}
	);
}
