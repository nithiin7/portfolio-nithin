import { describe, expect, it } from 'vitest';

import {
	IMAGE_CROPS,
	PREVIEW_VIEWPORTS,
	appliesAt,
	safeZone,
	visibleBox,
} from './imageCrops';

describe('imageCrops', () => {
	it('safe zone is the 21:9 height × 4:3 width of a 3840×2160 master', () => {
		expect(safeZone()).toEqual({ width: 2880, height: 1645 });
	});

	it('cover windows are centred crops of the master', () => {
		expect(visibleBox(16 / 9)).toEqual({ width: 3840, height: 2160 });
		expect(visibleBox(4 / 3)).toEqual({ width: 2880, height: 2160 });
		expect(visibleBox(16 / 10)).toEqual({ width: 3456, height: 2160 });
		expect(visibleBox(16 / 9, 1.15).width).toBeCloseTo(3339.13, 1);
	});

	it('every slot resolves at least one rule at each preview viewport', () => {
		for (const viewport of PREVIEW_VIEWPORTS) {
			const slots = new Set(
				IMAGE_CROPS.filter((crop) => appliesAt(crop, viewport)).map(
					(crop) => `${crop.component}:${crop.slot}`
				)
			);
			expect(slots.has('CaseStudy:cover')).toBe(true);
			expect(slots.has('WorksFeatured:lead')).toBe(true);
			expect(slots.has('PortfolioGallery:wide')).toBe(true);
		}
	});
});
