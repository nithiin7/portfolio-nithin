// JS mirror of the values in tokens.scss that cannot be read from CSS:
// <meta theme-color>, the web manifest, and Motion/JS easing.
// tokens.test.ts fails if these drift from the SCSS source.

export const palette = {
	ink: '#0b0b0b',
	paper: '#f2f1ec',
} as const;

export const ease = [0.7, 0, 0.2, 1] as const;

export const duration = {
	fast: 0.4,
	base: 0.8,
	slow: 1.2,
} as const;
