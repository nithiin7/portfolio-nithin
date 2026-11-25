import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

import { ConsentProvider, useConsent } from 'contexts/ConsentContext';
import { CONSENT_STORAGE_KEY, readConsent } from 'helpers/consent';

import ConsentBanner from './ConsentBanner';

beforeAll(() => {
	MotionGlobalConfig.skipAnimations = true;
});

const reload = vi.fn();

beforeEach(() => {
	localStorage.clear();
	window.gtag = vi.fn();
	Object.defineProperty(window, 'location', {
		value: { ...window.location, reload, hostname: 'localhost' },
		configurable: true,
	});
});

afterEach(() => {
	reload.mockReset();
	delete window.gtag;
	document.documentElement.removeAttribute('data-preload');
	Object.defineProperty(navigator, 'globalPrivacyControl', {
		value: undefined,
		configurable: true,
	});
});

const Opener = () => {
	const { openSettings } = useConsent();
	return (
		<button type="button" onClick={(e) => openSettings(e.currentTarget)}>
			Cookie settings
		</button>
	);
};

const renderBanner = () =>
	render(
		<ConsentProvider>
			<Opener />
			<ConsentBanner />
		</ConsentProvider>
	);

const region = () =>
	screen.queryByRole('region', { name: /count your visit/i });

const storeChoice = (analytics: boolean) =>
	localStorage.setItem(
		CONSENT_STORAGE_KEY,
		JSON.stringify({ v: 1, ts: Date.now(), analytics })
	);

describe('ConsentBanner', () => {
	it('asks first-time visitors without moving their focus', () => {
		renderBanner();

		expect(region()).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument();
		expect(document.body).toHaveFocus();
	});

	it('accepting stores the choice and grants analytics', async () => {
		renderBanner();

		fireEvent.click(screen.getByRole('button', { name: 'Accept' }));

		expect(readConsent()).toEqual({ analytics: true });
		expect(window.gtag).toHaveBeenCalledWith(
			'consent',
			'update',
			expect.objectContaining({ analytics_storage: 'granted' })
		);
		await waitFor(() => expect(region()).not.toBeInTheDocument());
	});

	it('declining stores the choice and keeps analytics denied', async () => {
		renderBanner();

		fireEvent.click(screen.getByRole('button', { name: 'Decline' }));

		expect(readConsent()).toEqual({ analytics: false });
		expect(window.gtag).toHaveBeenCalledWith(
			'consent',
			'update',
			expect.objectContaining({ analytics_storage: 'denied' })
		);
		expect(reload).not.toHaveBeenCalled();
		await waitFor(() => expect(region()).not.toBeInTheDocument());
	});

	it('stays hidden for a returning visitor and under Global Privacy Control', () => {
		storeChoice(false);
		const { unmount } = renderBanner();
		expect(region()).not.toBeInTheDocument();
		unmount();

		localStorage.clear();
		Object.defineProperty(navigator, 'globalPrivacyControl', {
			value: true,
			configurable: true,
		});
		renderBanner();
		expect(region()).not.toBeInTheDocument();
	});

	it('waits for the first-visit preloader to finish', async () => {
		document.documentElement.setAttribute('data-preload', 'true');
		renderBanner();
		expect(region()).not.toBeInTheDocument();

		await act(async () => {
			document.documentElement.removeAttribute('data-preload');
		});

		expect(region()).toBeInTheDocument();
	});

	it('customise: toggles analytics, saves, and Back returns focus', () => {
		renderBanner();

		fireEvent.click(screen.getByRole('button', { name: 'Customise' }));
		const toggle = screen.getByRole('switch', { name: 'Analytics' });
		expect(toggle).toHaveFocus();
		expect(toggle).toHaveAttribute('aria-checked', 'false');

		fireEvent.click(screen.getByRole('button', { name: 'Back' }));
		expect(screen.getByRole('button', { name: 'Customise' })).toHaveFocus();

		fireEvent.click(screen.getByRole('button', { name: 'Customise' }));
		fireEvent.click(screen.getByRole('switch', { name: 'Analytics' }));
		fireEvent.click(screen.getByRole('button', { name: 'Save choices' }));

		expect(readConsent()).toEqual({ analytics: true });
	});

	it('reopens from the footer, closes on Escape and returns focus', async () => {
		storeChoice(true);
		renderBanner();
		const opener = screen.getByRole('button', { name: 'Cookie settings' });

		fireEvent.click(opener);
		const toggle = screen.getByRole('switch', { name: 'Analytics' });
		expect(toggle).toHaveAttribute('aria-checked', 'true');
		expect(toggle).toHaveFocus();

		fireEvent.keyDown(toggle, { key: 'Escape' });
		expect(opener).toHaveFocus();
		await waitFor(() => expect(region()).not.toBeInTheDocument());
	});

	it('withdrawing consent clears cookies and reloads to unload the tags', () => {
		storeChoice(true);
		document.cookie = '_ga=GA1.1.1; path=/';
		renderBanner();

		fireEvent.click(screen.getByRole('button', { name: 'Cookie settings' }));
		fireEvent.click(screen.getByRole('switch', { name: 'Analytics' }));
		fireEvent.click(screen.getByRole('button', { name: 'Save choices' }));

		expect(readConsent()).toEqual({ analytics: false });
		expect(document.cookie).not.toMatch(/_ga/);
		expect(reload).toHaveBeenCalledOnce();
	});
});
