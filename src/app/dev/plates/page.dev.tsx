import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import PlatePreview, {
	type PlateGroup,
} from 'components/pages/dev/PlatePreview/PlatePreview';
import type { PlateManifestEntry } from 'types/plates';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Plates',
	robots: { index: false, follow: false },
};

const OUT_DIR = resolve(
	/* turbopackIgnore: true */ process.cwd(),
	'scripts/plates/out'
);

const loadGroups = async (): Promise<PlateGroup[]> => {
	const slugs = await readdir(OUT_DIR).catch(() => []);
	const groups = await Promise.all(
		slugs.map(async (slug) => {
			try {
				const json = await readFile(
					resolve(OUT_DIR, slug, 'plates.json'),
					'utf8'
				);
				return { slug, plates: JSON.parse(json) as PlateManifestEntry[] };
			} catch {
				return null;
			}
		})
	);
	return groups.filter((group): group is PlateGroup => group !== null);
};

interface PlatesPageProps {
	searchParams: Promise<{ debug?: string }>;
}

export default async function PlatesPage({
	searchParams,
}: PlatesPageProps): Promise<ReactElement> {
	const { debug } = await searchParams;
	return <PlatePreview groups={await loadGroups()} debug={debug === '1'} />;
}
