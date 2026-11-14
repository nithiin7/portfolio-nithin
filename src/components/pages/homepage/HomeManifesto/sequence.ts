export interface ManifestoFrame {
	index: number;
	resolve: number;
}

export const CHANGE_HALF_WIDTH = 0.3;

export const manifestoFrame = (
	progress: number,
	count: number,
	half = CHANGE_HALF_WIDTH
): ManifestoFrame => {
	if (count <= 1) return { index: 0, resolve: 1 };
	const slot = Math.min(Math.max(progress, 0), 1) * count;
	const boundary = Math.round(slot);
	const offset = slot - boundary;

	if (boundary >= 1 && boundary <= count - 1 && Math.abs(offset) < half) {
		return offset < 0
			? { index: boundary - 1, resolve: -offset / half }
			: { index: boundary, resolve: offset / half };
	}
	return { index: Math.min(Math.floor(slot), count - 1), resolve: 1 };
};
