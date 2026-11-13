/**
 * Dates from the old text fields, provider logos from contentful/seed-assets/*.svg, cleaned
 * credential IDs, and no highlight on expired certifications. Drafts only.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { link, value, type Client } from '../lib/cma.ts';

const ROOT = resolve(import.meta.dirname, '../..');
const TODAY = new Date().toISOString().slice(0, 10);

const PROVIDER_LOGO: Record<string, string> = {
	'/openai.svg': 'openai',
	'/databricks.svg': 'databricks',
	'/meta.svg': 'meta',
	'/udemy.svg': 'udemy',
	'/ibm.svg': 'ibm',
	'/google.svg': 'google',
	'/contentful.svg': 'contentful',
	'/hubspot.svg': 'hubspot',
};

const PROVIDER_NAME: Record<string, string> = {
	openai: 'OpenAI',
	databricks: 'Databricks',
	meta: 'Meta',
	udemy: 'Udemy',
	ibm: 'IBM',
	google: 'Google',
	contentful: 'Contentful',
	hubspot: 'HubSpot',
};

const isoDate = (text?: string): string | undefined =>
	text && /^\d{4}-\d{2}-\d{2}$/.test(text.trim()) ? text.trim() : undefined;

export default async function run(client: Client): Promise<void> {
	for (const slug of new Set(Object.values(PROVIDER_LOGO))) {
		const bytes = await readFile(
			resolve(ROOT, `contentful/seed-assets/${slug}.svg`)
		);
		await client.ensureAsset(
			`cert-${slug}-logo`,
			bytes,
			{ fileName: `cert-${slug}--logo.svg`, contentType: 'image/svg+xml' },
			{
				title: `${PROVIDER_NAME[slug]} — logo`,
				description: `${PROVIDER_NAME[slug]} logo`,
			}
		);
	}

	const certs = await client.getEntries({ content_type: 'certification' });
	for (const cert of certs) {
		const name = value<string>(cert, 'name') ?? '';
		const provider = value<string>(cert, 'provider') ?? '';
		const logo = PROVIDER_LOGO[value<string>(cert, 'logo') ?? ''];
		const expiresOn = isoDate(value<string>(cert, 'expiryDate'));
		const credentialId = value<string>(cert, 'credentialId')
			?.replace(/\s+/g, '')
			.replace(/\/+$/, '');
		await client.upsertEntry(cert.sys.id, 'certification', {
			internalName: `Cert — ${provider}, ${name}`,
			issuedOn: isoDate(value<string>(cert, 'issuedDate')),
			expiresOn,
			credentialId: credentialId || undefined,
			...(logo && { providerLogo: link(`cert-${logo}-logo`, 'Asset') }),
			...(expiresOn && expiresOn < TODAY && { highlight: false }),
		});
	}
}
