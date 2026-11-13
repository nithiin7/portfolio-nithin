export type Rng = () => number;

/** Mono-friendly, reads as "decoding" without looking like an error. */
export const DEFAULT_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_+=*#';

/** Glyph swaps run at ~30fps whatever the display refresh rate. */
export const SWAP_INTERVAL_MS = 1000 / 30;

const BLANK = /\s/;

/** Split by code point so emoji and astral characters stay whole. */
export const toChars = (text: string): string[] => Array.from(text);

/**
 * Progress (0–1) at which each character resolves. Left to right, with up to
 * `jitter` of the timeline shuffled per character so the edge looks organic.
 * Whitespace resolves at 0: it never scrambles. Every value is ≤ 1, so
 * progress 1 always shows the final text.
 */
export const resolveSchedule = (
	text: string,
	jitter = 0.3,
	rng: Rng = Math.random
): number[] => {
	const chars = toChars(text);
	const visible = chars.filter((char) => !BLANK.test(char)).length;
	const spread = Math.min(Math.max(jitter, 0), 1);
	let rank = 0;
	return chars.map((char) => {
		if (BLANK.test(char)) return 0;
		rank += 1;
		const base = rank / visible;
		return Math.min(1, base * (1 - spread) + rng() * spread);
	});
};

/**
 * One frame: `null` where the character has resolved, otherwise the glyph to
 * show in its place.
 */
export const scrambleFrame = (
	schedule: number[],
	progress: number,
	glyphs: string = DEFAULT_GLYPHS,
	rng: Rng = Math.random
): (string | null)[] => {
	const set = toChars(glyphs);
	return schedule.map((at) =>
		progress >= at || set.length === 0
			? null
			: (set[Math.floor(rng() * set.length) % set.length] ?? null)
	);
};
