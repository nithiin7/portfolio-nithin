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

if (typeof window !== 'undefined' && !window.ResizeObserver) {
	window.ResizeObserver = class {
		observe(): void {}
		unobserve(): void {}
		disconnect(): void {}
	};
}

if (typeof window !== 'undefined' && !window.IntersectionObserver) {
	window.IntersectionObserver = class {
		readonly root = null;
		readonly rootMargin = '';
		readonly thresholds = [];
		observe(): void {}
		unobserve(): void {}
		disconnect(): void {}
		takeRecords(): IntersectionObserverEntry[] {
			return [];
		}
	};
}
