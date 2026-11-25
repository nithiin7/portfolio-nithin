export const CONSENT_STORAGE_KEY = 'consent';
const CONSENT_VERSION = 1;
// Re-ask after six months, the shortest window EU regulators recommend.
const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
const ANALYTICS_COOKIE = /^(_ga|_gid|_gat)/;

export interface ConsentChoice {
	analytics: boolean;
}

interface StoredConsent extends ConsentChoice {
	v: number;
	ts: number;
}

declare global {
	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
	interface Navigator {
		globalPrivacyControl?: boolean;
	}
}

const isStoredConsent = (value: unknown): value is StoredConsent =>
	typeof value === 'object' &&
	value !== null &&
	(value as StoredConsent).v === CONSENT_VERSION &&
	typeof (value as StoredConsent).analytics === 'boolean' &&
	typeof (value as StoredConsent).ts === 'number';

/** A stored choice, or null when it is missing, stale or malformed. */
export const parseConsent = (
	raw: string | null,
	now: number = Date.now()
): ConsentChoice | null => {
	if (!raw) return null;
	try {
		const value: unknown = JSON.parse(raw);
		if (!isStoredConsent(value)) return null;
		if (now - value.ts > CONSENT_MAX_AGE_MS || value.ts > now) return null;
		return { analytics: value.analytics };
	} catch {
		return null;
	}
};

/** The visitor's saved consent choice, if any. */
export const readConsent = (): ConsentChoice | null => {
	try {
		return parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
	} catch {
		return null;
	}
};

/** Saves the visitor's consent choice with a timestamp. */
export const writeConsent = (choice: ConsentChoice): void => {
	const stored: StoredConsent = {
		v: CONSENT_VERSION,
		ts: Date.now(),
		analytics: choice.analytics,
	};
	try {
		localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
	} catch {
		// Private mode can refuse storage; the choice still holds for this page.
	}
};

/** Whether the browser sends a Global Privacy Control opt-out signal. */
export const hasPrivacySignal = (): boolean =>
	typeof navigator !== 'undefined' && navigator.globalPrivacyControl === true;

/** Google Consent Mode v2 state for a choice. Ads signals stay denied. */
export const toGoogleConsent = (
	choice: ConsentChoice
): Record<string, 'granted' | 'denied'> => ({
	ad_storage: 'denied',
	ad_user_data: 'denied',
	ad_personalization: 'denied',
	analytics_storage: choice.analytics ? 'granted' : 'denied',
	functionality_storage: 'granted',
	personalization_storage: 'denied',
	security_storage: 'granted',
});

/** Pushes a consent update to Google tags. */
export const updateGoogleConsent = (choice: ConsentChoice): void => {
	window.gtag?.('consent', 'update', toGoogleConsent(choice));
};

/** Deletes Google Analytics cookies on this host and its parent domains. */
export const clearAnalyticsCookies = (): void => {
	const parts = window.location.hostname.split('.');
	const domains = [''];
	for (let i = 0; i < parts.length - 1; i += 1) {
		domains.push(`; domain=.${parts.slice(i).join('.')}`);
	}

	for (const cookie of document.cookie.split(';')) {
		const name = cookie.split('=')[0]?.trim();
		if (!name || !ANALYTICS_COOKIE.test(name)) continue;
		for (const domain of domains) {
			document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
		}
	}
};

/**
 * Inline head script: defines gtag and sets Consent Mode defaults before any
 * Google tag can load, granting analytics only for a valid stored opt-in.
 */
export const consentScript = `(function(){var w=window;w.dataLayer=w.dataLayer||[];w.gtag=function(){w.dataLayer.push(arguments)};var g=false;try{var c=JSON.parse(localStorage.getItem('${CONSENT_STORAGE_KEY}'));var a=c&&Date.now()-c.ts;g=!!(c&&c.v===${CONSENT_VERSION}&&c.analytics===true&&a>=0&&a<=${CONSENT_MAX_AGE_MS})}catch(e){}var d=${JSON.stringify(toGoogleConsent({ analytics: false }))};d.analytics_storage=g?'granted':'denied';w.gtag('consent','default',d);w.gtag('set','ads_data_redaction',true)})();`;
