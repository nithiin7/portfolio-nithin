/**
 * Analytics module for Google Tag Manager (GTM) integration.
 * Provides functions to initialize GTM, log page views, and log custom events.
 */

import TagManager from 'react-gtm-module';

const eventName = 'app_event';

/**
 * Initializes Google Tag Manager.
 * Ensures execution only in the client environment.
 */
const init = () => {
	if (typeof window !== 'object') return false;

	const gtmId = process.env.NEXT_PUBLIC_GOOGLE_GTM_ID;
	if (!gtmId) {
		console.warn('GTM ID is not defined');
		return false;
	}

	TagManager.initialize({ gtmId: gtmId });
};

/**
 * Logs a page view event to Google Tag Manager.
 */
const logPageView = () => {
	if (typeof window !== 'object') return false;

	TagManager.dataLayer({
		dataLayer: {
			event: 'pageview',
			page: window.location.pathname,
		},
	});
};

/**
 * Logs a custom event to Google Tag Manager.
 *
 * @param {string} eventCategory - Category of the event.
 * @param {string} eventAction - Action performed.
 * @param {string} [eventLabel] - Optional label for the event.
 * @param {number} [eventValue] - Optional numerical value for the event.
 */
const logEvent = (
	eventCategory: string,
	eventAction: string,
	eventLabel?: string,
	eventValue?: number
) => {
	TagManager.dataLayer({
		dataLayer: {
			event: eventName,
			category: eventCategory,
			action: eventAction,
			label: eventLabel,
			value: eventValue,
		},
	});
};

export { init, logPageView, logEvent };
