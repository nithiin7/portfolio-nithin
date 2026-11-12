// JS mirror of the values in tokens.scss that cannot be read from CSS:
// <meta theme-color>, the web manifest, generated OG images, image plates and
// Motion/JS easing.
// tokens.test.ts fails if these drift from the SCSS source.

export const palette = {
	ink: '#0b0b0b',
	paper: '#f2f1ec',
	grey500: '#8c8a84',
	orange: '#ff4d00',
} as const;

/** Alpha of the --line hairline: paper-on-ink (dark) and ink-on-paper (light). */
export const lineAlpha = {
	onInk: 0.14,
	onPaper: 0.12,
} as const;

export const ease = [0.7, 0, 0.2, 1] as const;

export const duration = {
	fast: 0.4,
	base: 0.8,
	slow: 1.2,
} as const;
