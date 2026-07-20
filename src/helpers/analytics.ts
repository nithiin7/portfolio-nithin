/**
 * Analytics module for Google Tag Manager (GTM) integration.
 */

const eventName = 'app_event';

declare global {
	interface Window {
		dataLayer?: Record<string, unknown>[];
	}
}

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
	if (typeof window !== 'object') return;

	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		event: eventName,
		category: eventCategory,
		action: eventAction,
		label: eventLabel,
		value: eventValue,
	});
};

export { logEvent };
