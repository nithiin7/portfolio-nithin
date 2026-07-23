import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
	cleanup();
});

if (typeof window !== 'undefined' && !window.matchMedia) {
	window.matchMedia = (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	});
}

/**
 * Node's built-in `localStorage` global (backed by an unset `--localstorage-file`)
 * shadows jsdom's own implementation and throws on every write, so tests that
 * touch localStorage need an in-memory stand-in instead.
 */
function createMemoryStorage(): Storage {
	const store = new Map<string, string>();

	return {
		getItem: (key: string) =>
			store.has(key) ? (store.get(key) as string) : null,
		setItem: (key: string, value: string) => {
			store.set(key, String(value));
		},
		removeItem: (key: string) => {
			store.delete(key);
		},
		clear: () => {
			store.clear();
		},
		key: (index: number) => Array.from(store.keys())[index] ?? null,
		get length() {
			return store.size;
		},
	} as Storage;
}

if (typeof window !== 'undefined') {
	Object.defineProperty(window, 'localStorage', {
		value: createMemoryStorage(),
		writable: true,
		configurable: true,
	});
}
