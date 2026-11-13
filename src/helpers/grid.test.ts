import { describe, expect, it } from 'vitest';

import { packSpans } from './grid';

describe('packSpans', () => {
	it('keeps spans that already fill rows', () => {
		expect(packSpans([7, 5, 5, 4, 3])).toEqual([7, 5, 5, 4, 3]);
	});

	it('stretches the last cell of a row when the next one does not fit', () => {
		expect(packSpans([5, 5, 4, 3])).toEqual([5, 7, 4, 8]);
	});

	it('fills the final row', () => {
		expect(packSpans([7])).toEqual([12]);
		expect(packSpans([])).toEqual([]);
	});
});
