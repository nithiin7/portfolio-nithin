import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const OUT_DIR = resolve(
	/* turbopackIgnore: true */ process.cwd(),
	'scripts/plates/out'
);

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string; file: string }> }
): Promise<Response> {
	const { slug, file } = await params;
	if (!/^[a-z0-9-]+$/.test(slug) || !/^[a-z0-9.-]+\.png$/.test(file)) {
		return new Response('Not found', { status: 404 });
	}
	try {
		const bytes = await readFile(resolve(OUT_DIR, slug, file));
		return new Response(bytes, {
			headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
		});
	} catch {
		return new Response('Not found', { status: 404 });
	}
}
