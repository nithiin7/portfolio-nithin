'use client';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import {
	clearAnalyticsCookies,
	hasPrivacySignal,
	readConsent,
	updateGoogleConsent,
	writeConsent,
	type ConsentChoice,
} from 'helpers/consent';

type ConsentView = 'hidden' | 'prompt' | 'settings';

interface ConsentContextType {
	analytics: boolean;
	decided: boolean;
	view: ConsentView;
	save: (choice: ConsentChoice) => void;
	openSettings: (opener?: HTMLElement | null) => void;
	showPrompt: () => void;
	close: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const PRELOAD_ATTR = 'data-preload';

// The first-visit preloader covers the page; reveal the prompt after it.
const afterPreloader = (reveal: () => void): (() => void) => {
	const root = document.documentElement;
	if (!root.hasAttribute(PRELOAD_ATTR)) {
		reveal();
		return () => undefined;
	}
	const observer = new MutationObserver(() => {
		if (root.hasAttribute(PRELOAD_ATTR)) return;
		observer.disconnect();
		reveal();
	});
	observer.observe(root, { attributes: true, attributeFilter: [PRELOAD_ATTR] });
	return () => observer.disconnect();
};

/** Holds the visitor's analytics consent and the banner's visibility. */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
	const [analytics, setAnalytics] = useState(false);
	const [decided, setDecided] = useState(false);
	const [view, setView] = useState<ConsentView>('hidden');
	const openerRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const stored = readConsent();
		if (stored) {
			setAnalytics(stored.analytics);
			setDecided(true);
			return;
		}
		// A Global Privacy Control signal is an opt-out; don't nag about it.
		if (hasPrivacySignal()) return;
		return afterPreloader(() => setView('prompt'));
	}, []);

	const close = useCallback(() => {
		setView('hidden');
		const opener = openerRef.current;
		openerRef.current = null;
		if (opener?.isConnected) opener.focus({ preventScroll: true });
	}, []);

	const save = useCallback(
		(choice: ConsentChoice) => {
			const revoked = analytics && !choice.analytics;
			writeConsent(choice);
			updateGoogleConsent(choice);
			setAnalytics(choice.analytics);
			setDecided(true);
			close();
			if (!choice.analytics) clearAnalyticsCookies();
			// Loaded tags can't be unloaded; a reload is the only clean stop.
			if (revoked) window.location.reload();
		},
		[analytics, close]
	);

	const openSettings = useCallback((opener?: HTMLElement | null) => {
		openerRef.current = opener ?? null;
		setView('settings');
	}, []);

	const showPrompt = useCallback(() => setView('prompt'), []);

	const value = useMemo(
		() => ({ analytics, decided, view, save, openSettings, showPrompt, close }),
		[analytics, decided, view, save, openSettings, showPrompt, close]
	);

	return (
		<ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
	);
}

/** Current consent state and the actions that change it. */
export function useConsent() {
	const context = useContext(ConsentContext);
	if (context === undefined) {
		throw new Error('useConsent must be used within a ConsentProvider');
	}
	return context;
}
