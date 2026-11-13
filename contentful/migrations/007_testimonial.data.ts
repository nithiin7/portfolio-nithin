/** Split "Role - Organisation", strip literal quote marks, fix names. Drafts only. */
import { value, type Client } from '../lib/cma.ts';

const stripQuotes = (text = ''): string =>
	text
		.trim()
		.replace(/^["“”']+|["“”']+$/g, '')
		.trim();

export default async function run(client: Client): Promise<void> {
	const quotes = await client.getEntries({ content_type: 'testimonialCard' });
	for (const quote of quotes) {
		const author = value<string>(quote, 'reviewer') ?? '';
		const [role, ...rest] = (value<string>(quote, 'institution') ?? '').split(
			' - '
		);
		await client.upsertEntry(quote.sys.id, 'testimonialCard', {
			name: `Testimonial — ${author}`,
			review: stripQuotes(value<string>(quote, 'review')),
			authorRole: role!.trim(),
			organisation: rest.join(' - ').trim(),
		});
	}
}
