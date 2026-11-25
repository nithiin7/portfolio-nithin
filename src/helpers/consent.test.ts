import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	CONSENT_STORAGE_KEY,
	clearAnalyticsCookies,
	consentScript,
	hasPrivacySignal,
	parseConsent,
	readConsent,
	toGoogleConsent,
	updateGoogleConsent,
	writeConsent,
} from './consent';

const NOW = Date.UTC(2026, 10, 25);
const DAY = 24 * 60 * 60 * 1000;

const stored = (overrides: Record<string, unknown> = {}): string =>
	JSON.stringify({ v: 1, ts: NOW - DAY, analytics: true, ...overrides });

describe('parseConsent', () => {
	it('returns the choice for a fresh, well-formed record', () => {
		expect(parseConsent(stored(), NOW)).toEqual({ analytics: true });
		expect(parseConsent(stored({ analytics: false }), NOW)).toEqual({
			analytics: false,
		});
	});

	it.each([
		['missing', null],
		['not JSON', '{nope'],
		['an old version', stored({ v: 0 })],
		['a non-boolean choice', stored({ analytics: 'yes' })],
		['older than six months', stored({ ts: NOW - 181 * DAY })],
		['dated in the future', stored({ ts: NOW + DAY })],
	])('rejects a record that is %s', (_, raw) => {
		expect(parseConsent(raw, NOW)).toBeNull();
	});
});

describe('storage', () => {
	beforeEach(() => localStorage.clear());

	it('round-trips a choice through localStorage', () => {
		expect(readConsent()).toBeNull();
		writeConsent({ analytics: false });
		expect(readConsent()).toEqual({ analytics: false });
		expect(
			JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? '')
		).toMatchObject({ v: 1, analytics: false });
	});

	it('survives storage that throws', () => {
		const spy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
			throw new Error('denied');
		});
		expect(readConsent()).toBeNull();
		spy.mockRestore();

		const set = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
			throw new Error('quota');
		});
		expect(() => writeConsent({ analytics: true })).not.toThrow();
		set.mockRestore();
	});
});

describe('Google Consent Mode', () => {
	afterEach(() => {
		delete window.gtag;
		delete window.dataLayer;
	});

	it('grants analytics storage only, never ads', () => {
		expect(toGoogleConsent({ analytics: true })).toMatchObject({
			analytics_storage: 'granted',
			ad_storage: 'denied',
			ad_user_data: 'denied',
			ad_personalization: 'denied',
		});
		expect(toGoogleConsent({ analytics: false }).analytics_storage).toBe(
			'denied'
		);
	});

	it('sends an update through gtag when it exists', () => {
		expect(() => updateGoogleConsent({ analytics: true })).not.toThrow();
		window.gtag = vi.fn();
		updateGoogleConsent({ analytics: true });
		expect(window.gtag).toHaveBeenCalledWith(
			'consent',
			'update',
			expect.objectContaining({ analytics_storage: 'granted' })
		);
	});

	const runScript = (): unknown[] => {
		new Function(consentScript)();
		return (window.dataLayer ?? []).map((entry) =>
			Array.from(entry as ArrayLike<unknown>)
		);
	};

	it('defaults to denied without a stored opt-in', () => {
		localStorage.clear();
		expect(runScript()[0]).toEqual([
			'consent',
			'default',
			expect.objectContaining({ analytics_storage: 'denied' }),
		]);
	});

	it('defaults to granted for a valid stored opt-in', () => {
		localStorage.setItem(
			CONSENT_STORAGE_KEY,
			JSON.stringify({ v: 1, ts: Date.now() - DAY, analytics: true })
		);
		expect(runScript()[0]).toEqual([
			'consent',
			'default',
			expect.objectContaining({
				analytics_storage: 'granted',
				ad_storage: 'denied',
			}),
		]);
		localStorage.clear();
	});
});

describe('privacy signal and cookies', () => {
	afterEach(() => {
		Object.defineProperty(navigator, 'globalPrivacyControl', {
			value: undefined,
			configurable: true,
		});
	});

	it('reads Global Privacy Control', () => {
		expect(hasPrivacySignal()).toBe(false);
		Object.defineProperty(navigator, 'globalPrivacyControl', {
			value: true,
			configurable: true,
		});
		expect(hasPrivacySignal()).toBe(true);
	});

	it('deletes Google Analytics cookies and keeps the rest', () => {
		document.cookie = '_ga=GA1.1.1; path=/';
		document.cookie = '_ga_ABC123=GS1.1; path=/';
		document.cookie = 'keep=1; path=/';

		clearAnalyticsCookies();

		expect(document.cookie).not.toMatch(/_ga/);
		expect(document.cookie).toContain('keep=1');
		document.cookie = 'keep=; Max-Age=0; path=/';
	});
});
