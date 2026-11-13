/** Collaborator logos (from contentful/seed-assets/logos) as Links with a logo. Drafts only. */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { link, type Client } from '../lib/cma.ts';

const ROOT = resolve(import.meta.dirname, '../..');

const collaborators = [
	{ file: 'ey', name: 'EY', url: 'https://www.ey.com/' },
	{ file: 'hsbc', name: 'HSBC', url: 'https://www.hsbc.com/' },
	{
		file: 'morgan-stanley',
		name: 'Morgan Stanley',
		url: 'https://www.morganstanley.com/',
	},
	{
		file: 'paytm-payments-bank',
		name: 'Paytm Payments Bank',
		url: 'https://www.paytmbank.com/',
	},
	{ file: 'spotify', name: 'Spotify', url: 'https://connect.spotify.com/' },
	{
		file: 'spotify-codes',
		name: 'Spotify Codes',
		url: 'https://www.spotifycodes.com/',
	},
	{
		file: 'game-awards',
		name: 'The Game Awards',
		url: 'https://thegameawards.com/',
	},
	{
		file: 'white-rabbit',
		name: 'White Rabbit',
		url: 'https://whiterabbit.group/',
	},
];

export default async function run(client: Client): Promise<void> {
	for (const collaborator of collaborators) {
		const bytes = await readFile(
			resolve(ROOT, `contentful/seed-assets/logos/${collaborator.file}.svg`)
		);
		await client.ensureAsset(
			`collab-${collaborator.file}-logo`,
			bytes,
			{
				fileName: `collab-${collaborator.file}--logo.svg`,
				contentType: 'image/svg+xml',
			},
			{
				title: `${collaborator.name} — logo`,
				description: `${collaborator.name} logo`,
			}
		);
		await client.upsertEntry(`link-collab-${collaborator.file}`, 'link', {
			internalName: `Link — Collaborator ${collaborator.name}`,
			label: collaborator.name,
			url: collaborator.url,
			logo: link(`collab-${collaborator.file}-logo`, 'Asset'),
			openInNewTab: true,
		});
	}
}
