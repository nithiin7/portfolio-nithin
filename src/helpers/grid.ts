const COLUMNS = 12;

const widenLast = (packed: number[], by: number): void => {
	const last = packed.length - 1;
	if (last >= 0) packed[last] = (packed[last] ?? 0) + by;
};

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
