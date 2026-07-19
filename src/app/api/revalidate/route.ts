import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface ContentfulWebhookBody {
	sys?: {
		contentType?: {
			sys?: {
				id?: string;
			};
		};
	};
	fields?: {
		slug?: Record<string, string>;
	};
}

type RevalidateTarget = [path: string, type?: 'page' | 'layout'];

// Blog listing (/blog) renders dynamically via searchParams and feed.xml is an
// uncached route handler, so neither needs revalidation here.
const getTargets = (
	contentType: string | undefined,
	slug: string | undefined
): RevalidateTarget[] => {
	switch (contentType) {
		case 'blogPost':
			return [['/blog/[slug]', 'page'], ['/sitemap.xml']];
		case 'portfolioDetails':
			return [['/'], ['/portfolio/[id]', 'page'], ['/sitemap.xml']];
		case 'page':
			if (slug === 'home') return [['/']];
			if (slug) return [[`/${slug}`]];
			return [['/', 'layout']];
		default:
			// Nested section/content entries don't identify their parent page,
			// so revalidate everything under the root layout
			return [['/', 'layout']];
	}
};

export async function POST(request: NextRequest) {
	const secret = request.headers.get('x-revalidate-secret');
	if (
		!process.env.CONTENTFUL_REVALIDATE_SECRET ||
		secret !== process.env.CONTENTFUL_REVALIDATE_SECRET
	) {
		return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
	}

	let body: ContentfulWebhookBody = {};
	try {
		body = await request.json();
	} catch {
		// Contentful always sends JSON; an empty body falls through to the
		// full-site revalidation default
	}

	const contentType = body.sys?.contentType?.sys?.id;
	const localizedSlug = body.fields?.slug;
	const slug = localizedSlug ? Object.values(localizedSlug)[0] : undefined;

	const targets = getTargets(contentType, slug);
	targets.forEach(([path, type]) => revalidatePath(path, type));

	return NextResponse.json({
		revalidated: targets.map(([path]) => path),
		contentType: contentType ?? null,
	});
}
