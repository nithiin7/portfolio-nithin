'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type { SiteSettings } from 'types/site';

const SiteSettingsContext = createContext<SiteSettings | null>(null);

interface SiteSettingsProviderProps {
	value: SiteSettings;
	children: ReactNode;
}

/** Provides the Contentful site settings to client components. */
export const SiteSettingsProvider = ({
	value,
	children,
}: SiteSettingsProviderProps) => (
	<SiteSettingsContext.Provider value={value}>
		{children}
	</SiteSettingsContext.Provider>
);

/** Reads the site settings; throws outside the provider. */
export const useSiteSettings = (): SiteSettings => {
	const site = useContext(SiteSettingsContext);
	if (!site) {
		throw new Error('useSiteSettings needs a SiteSettingsProvider above it');
	}
	return site;
};
