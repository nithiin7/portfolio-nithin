const COLUMNS = 12;

/**
 * Packs preferred column spans into full 12-column rows: a cell that doesn't
 * fit starts a new row and the previous row's last cell stretches to close
 * the gap, so optional cards never leave holes.
 */
export const packSpans = (spans: number[], columns = COLUMNS): number[] => {
	const packed: number[] = [];
	let used = 0;
	spans.forEach((preferred) => {
		const span = Math.min(preferred, columns);
		if (used > 0 && used + span > columns) {
			packed[packed.length - 1] += columns - used;
			used = 0;
		}
		packed.push(span);
		used += span;
	});
	if (packed.length > 0) packed[packed.length - 1] += columns - used;
	return packed;
};
