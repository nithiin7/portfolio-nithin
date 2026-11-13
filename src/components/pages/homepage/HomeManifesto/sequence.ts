export interface ManifestoFrame {
	/** Word on screen. */
	index: number;
	/** How far that word has resolved, 0 (all glyphs) to 1 (final text). */
	resolve: number;
}

/** Half-width of a word change, in word slots: 0.3 = 60% of a slot. */
export const CHANGE_HALF_WIDTH = 0.3;

/**
 * Map pin progress (0–1) to the word on screen. Each word owns an equal slot;
 * around every slot boundary the outgoing word dissolves right to left and
 * the incoming one resolves left to right. The last change finishes before
 * the pin releases, so the final word is always settled when it scrolls away.
 */
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
