'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type { SiteSettings } from 'types/site';

const SiteSettingsContext = createContext<SiteSettings | null>(null);

interface SiteSettingsProviderProps {
	value: SiteSettings;
	children: ReactNode;
}

/** Hands the server-fetched Contentful Site Settings to client components. */
export const SiteSettingsProvider = ({
	value,
	children,
}: SiteSettingsProviderProps) => (
	<SiteSettingsContext.Provider value={value}>
		{children}
	</SiteSettingsContext.Provider>
);

export const useSiteSettings = (): SiteSettings => {
	const site = useContext(SiteSettingsContext);
	if (!site) {
		throw new Error('useSiteSettings needs a SiteSettingsProvider above it');
	}
	return site;
};
