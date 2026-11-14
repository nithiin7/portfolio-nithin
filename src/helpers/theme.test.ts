import { afterEach, describe, expect, it } from 'vitest';

import { THEME_STORAGE_KEY, themeScript } from 'helpers/theme';

const run = (): void => {
	new Function(themeScript)();
};

describe('themeScript', () => {
	afterEach(() => {
		localStorage.clear();
		document.documentElement.setAttribute('data-theme', 'dark');
	});

	it('applies a saved light theme before hydration', () => {
		localStorage.setItem(THEME_STORAGE_KEY, 'light');
		run();
		expect(document.documentElement.dataset.theme).toBe('light');
	});

	it('keeps the server theme when nothing is saved', () => {
		run();
		expect(document.documentElement.dataset.theme).toBe('dark');
	});

	it('ignores an unknown stored value', () => {
		localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
		run();
		expect(document.documentElement.dataset.theme).toBe('dark');
	});
});
