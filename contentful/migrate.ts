/**
 * Runs numbered Contentful migrations against one environment.
 *
 *   pnpm cms:migrate --env <id>                 # list applied / pending
 *   pnpm cms:migrate --env <id> --apply         # run every pending migration
 *   pnpm cms:migrate --env <id> --apply 004     # run one (must be pending)
 *   pnpm cms:migrate --env <id> --apply 002 --data-only
 *       # recovery: the schema half already ran but stopped part-way
 *       # (e.g. a plan limit); run only the data half and record it
 *
 * Each migration is `migrations/NNN_name.cjs` (schema, contentful-migration)
 * plus an optional `migrations/NNN_name.data.ts` (entries/assets, saved as
 * drafts). Applied migrations are recorded as `cmsMigration` entries in the
 * environment itself, so `master` and any clone track their own state.
 */
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import { runMigration } from 'contentful-migration';

import { createClient, value, type Client } from './lib/cma.ts';

const DIR = resolve(import.meta.dirname, 'migrations');
const LOG_TYPE = 'cmsMigration';

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
	const index = args.indexOf(name);
	return index === -1 ? undefined : args[index + 1];
};
const environment = flag('--env');
const only = args.filter((arg) => /^\d{3}$/.test(arg));
const apply = args.includes('--apply');
const dataOnly = args.includes('--data-only');

if (dataOnly && only.length !== 1) {
	console.error('--data-only needs exactly one migration number.');
	process.exit(1);
}

if (!environment) {
	console.error('Pass --env <environment id>. There is no default.');
	process.exit(1);
}

const applied = async (client: Client): Promise<Set<string>> => {
	try {
		const entries = await client.getEntries({ content_type: LOG_TYPE });
		return new Set(entries.map((entry) => value<string>(entry, 'id') ?? ''));
	} catch (error) {
		if (String(error).includes('→ 400') || String(error).includes('→ 404')) {
			return new Set();
		}
		throw error;
	}
};

const main = async (): Promise<void> => {
	const client = createClient(environment);
	const files = (await readdir(DIR)).sort();
	const migrations = files
		.filter((file) => /^\d{3}_.+\.cjs$/.test(file))
		.map((file) => ({
			id: file.slice(0, 3),
			name: file.replace(/\.cjs$/, ''),
			schema: resolve(DIR, file),
			data: files.includes(file.replace(/\.cjs$/, '.data.ts'))
				? resolve(DIR, file.replace(/\.cjs$/, '.data.ts'))
				: undefined,
		}));
	const done = await applied(client);

	console.log(`\nContentful environment: ${environment}\n`);
	for (const migration of migrations) {
		console.log(
			`  ${done.has(migration.id) ? '✓' : '·'} ${migration.name}${migration.data ? ' (+data)' : ''}`
		);
	}

	const pending = migrations.filter(
		(migration) =>
			!done.has(migration.id) &&
			(only.length === 0 || only.includes(migration.id))
	);
	const blocked = only.filter((id) => done.has(id));
	if (blocked.length) {
		console.error(`\nAlready applied: ${blocked.join(', ')}`);
		process.exit(1);
	}
	if (!apply) {
		console.log(
			pending.length
				? `\n${pending.length} pending. Re-run with --apply to run them.`
				: '\nNothing pending.'
		);
		return;
	}

	for (const migration of pending) {
		console.log(`\n→ ${migration.name} on ${environment}`);
		if (!dataOnly) {
			await runMigration({
				filePath: migration.schema,
				spaceId: process.env.CONTENTFUL_SPACE_ID,
				environmentId: environment,
				accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
				yes: true,
			});
		}
		if (migration.data) {
			const { default: run } = (await import(migration.data)) as {
				default: (client: Client) => Promise<void>;
			};
			await run(client);
		}
		await client.upsertEntry(`cmsMigration-${migration.id}`, LOG_TYPE, {
			id: migration.id,
			name: migration.name,
			ranAt: new Date().toISOString(),
		});
		console.log(`✓ ${migration.name}`);
	}
};

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
