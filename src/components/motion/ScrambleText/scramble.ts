export type Rng = () => number;

export const DEFAULT_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_+=*#';

export const SWAP_INTERVAL_MS = 1000 / 30;

const BLANK = /\s/;

/** Splits text into characters, keeping surrogate pairs whole. */
export const toChars = (text: string): string[] => Array.from(text);

/** Progress at which each character settles, left to right with jitter. */
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

/** Random glyph per unsettled character; null once settled. */
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
