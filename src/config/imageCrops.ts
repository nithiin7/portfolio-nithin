// Every place a portfolio image is cropped with object-fit: cover, mirrored from
// the component SCSS. scripts/plates derives the plate safe zone from this table
// and /dev/plates previews plates through it, so update both together.

export const MASTER = { width: 3840, height: 2160 } as const;

/** Which Contentful asset a slot renders. */
export type ImageField = 'card' | 'spotlight' | 'gallery';

export interface Viewport {
	width: number;
	height: number;
	touch: boolean;
}

export interface ImageCrop {
	component: string;
	slot: string;
	field: ImageField;
	/** Smallest viewport width (px) the rule applies at. */
	from: number;
	/** First viewport width (px) the rule no longer applies at. */
	until?: number;
	pointer?: 'touch' | 'fine';
	/** width / height, or computed from the viewport for full-bleed slots. */
	ratio: number | ((viewport: Viewport) => number);
	/** Resting transform scale on the image; shrinks what is visible. */
	zoom?: number;
	sizes: string;
	/** Atmospheric slots that may crop past the safe zone. */
	decorative?: boolean;
}

const W = 768;
const L = 1024;

// PortfolioNext__link: min-height 60svh across the full width, image at scale(1.15)
const nextBleed = ({ width, height }: Viewport): number =>
	width / (height * 0.6);

export const IMAGE_CROPS: ImageCrop[] = [
	{
		component: 'WorksFeatured',
		slot: 'lead',
		field: 'card',
		from: 0,
		until: W,
		ratio: 4 / 3,
		sizes: '100vw',
	},
	{
		component: 'WorksFeatured',
		slot: 'lead',
		field: 'card',
		from: W,
		ratio: 21 / 9,
		sizes: '100vw',
	},
	{
		component: 'WorksFeatured',
		slot: 'card',
		field: 'card',
		from: 0,
		ratio: 4 / 3,
		sizes: '(min-width: 768px) 50vw, 100vw',
	},
	{
		component: 'WorksIndex',
		slot: 'thumb',
		field: 'card',
		from: 0,
		pointer: 'touch',
		ratio: 16 / 10,
		sizes: '100vw',
	},
	{
		component: 'WorksPreview',
		slot: 'cursor',
		field: 'card',
		from: L,
		pointer: 'fine',
		ratio: 4 / 3,
		sizes:
			'(min-width: 1920px) 22vw, (min-width: 1616px) 420px, (min-width: 1000px) 26vw, 260px',
	},
	{
		component: 'PortfolioNext',
		slot: 'media',
		field: 'card',
		from: 0,
		pointer: 'touch',
		ratio: 16 / 9,
		sizes: '100vw',
	},
	{
		component: 'PortfolioNext',
		slot: 'bleed',
		field: 'card',
		from: L,
		pointer: 'fine',
		ratio: nextBleed,
		zoom: 1.15,
		sizes: '100vw',
		decorative: true,
	},
	{
		component: 'CaseStudy',
		slot: 'cover',
		field: 'spotlight',
		from: 0,
		until: W,
		ratio: 4 / 3,
		sizes: '100vw',
	},
	{
		component: 'CaseStudy',
		slot: 'cover',
		field: 'spotlight',
		from: W,
		until: L,
		ratio: 16 / 9,
		sizes: '100vw',
	},
	{
		component: 'CaseStudy',
		slot: 'cover',
		field: 'spotlight',
		from: L,
		ratio: 21 / 9,
		sizes: '100vw',
	},
	{
		component: 'PortfolioOG',
		slot: 'strip',
		field: 'spotlight',
		from: 0,
		ratio: 400 / 630,
		sizes: 'fixed 400×630',
		decorative: true,
	},
	{
		component: 'PortfolioGallery',
		slot: 'wide',
		field: 'gallery',
		from: 0,
		until: W,
		ratio: 4 / 3,
		sizes: '(min-width: 1280px) 66vw, (min-width: 1024px) 75vw, 100vw',
	},
	{
		component: 'PortfolioGallery',
		slot: 'wide',
		field: 'gallery',
		from: W,
		ratio: 16 / 9,
		sizes: '(min-width: 1280px) 66vw, (min-width: 1024px) 75vw, 100vw',
	},
	{
		component: 'PortfolioGallery',
		slot: 'half',
		field: 'gallery',
		from: 0,
		ratio: 4 / 3,
		sizes:
			'(min-width: 1280px) 33vw, (min-width: 1024px) 37vw, (min-width: 768px) 50vw, 100vw',
	},
];

export const ratioAt = (crop: ImageCrop, viewport: Viewport): number =>
	typeof crop.ratio === 'number' ? crop.ratio : crop.ratio(viewport);

export const appliesAt = (crop: ImageCrop, viewport: Viewport): boolean =>
	viewport.width >= crop.from &&
	(crop.until === undefined || viewport.width < crop.until) &&
	(crop.pointer === undefined || (crop.pointer === 'touch') === viewport.touch);

export interface Box {
	width: number;
	height: number;
}

/** Centred object-fit: cover window of the master that a ratio keeps visible. */
export const visibleBox = (
	ratio: number,
	zoom = 1,
	master: Box = MASTER
): Box => {
	const masterRatio = master.width / master.height;
	const width = ratio >= masterRatio ? master.width : master.height * ratio;
	const height = ratio >= masterRatio ? master.width / ratio : master.height;
	return { width: width / zoom, height: height / zoom };
};

/** Region of the master that survives every non-decorative crop. */
export const safeZone = (
	crops: ImageCrop[] = IMAGE_CROPS,
	master: Box = MASTER
): Box =>
	crops
		.filter((crop) => !crop.decorative && typeof crop.ratio === 'number')
		.map((crop) => visibleBox(crop.ratio as number, crop.zoom, master))
		.reduce(
			(zone, box) => ({
				width: Math.min(zone.width, Math.floor(box.width)),
				height: Math.min(zone.height, Math.floor(box.height)),
			}),
			{ width: master.width, height: master.height }
		);

/** Viewports the preview page and docs evaluate crops at. */
export const PREVIEW_VIEWPORTS: (Viewport & { label: string })[] = [
	{ label: '360 · touch', width: 360, height: 780, touch: true },
	{ label: '1440 · desktop', width: 1440, height: 900, touch: false },
	{ label: '3840 · 4K', width: 3840, height: 2160, touch: false },
];
