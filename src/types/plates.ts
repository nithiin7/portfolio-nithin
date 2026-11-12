import type { ImageField } from 'config/imageCrops';

export type PlateTemplate = 'cover' | 'detail' | 'mobile-trio' | 'type-plate';
export type PlateSurface = 'ink' | 'paper';

/** scripts/plates/out/<slug>/plates.json; read by /dev/plates and upload.ts. */
export interface PlateManifestEntry {
	file: string;
	debug: string;
	template: PlateTemplate;
	alt: string;
	use: ImageField[];
	surface: PlateSurface;
	/** Set when the same recipe was rendered on both surfaces. */
	variant?: boolean;
}
