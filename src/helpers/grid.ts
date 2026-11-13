const COLUMNS = 12;

/**
 * Packs preferred column spans into full 12-column rows: a cell that doesn't
 * fit starts a new row and the previous row's last cell stretches to close
 * the gap, so optional cards never leave holes.
 */
const widenLast = (packed: number[], by: number): void => {
	const last = packed.length - 1;
	if (last >= 0) packed[last] = (packed[last] ?? 0) + by;
};

/** Packs preferred column spans into rows of `columns`, widening each row's last item to fill it. */
export const packSpans = (spans: number[], columns = COLUMNS): number[] => {
	const packed: number[] = [];
	let used = 0;
	spans.forEach((preferred) => {
		const span = Math.min(preferred, columns);
		if (used > 0 && used + span > columns) {
			widenLast(packed, columns - used);
			used = 0;
		}
		packed.push(span);
		used += span;
	});
	widenLast(packed, columns - used);
	return packed;
};
