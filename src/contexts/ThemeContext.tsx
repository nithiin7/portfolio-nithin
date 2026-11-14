'use client';
import { createContext, useContext, useEffect, useState } from 'react';

import { THEME_STORAGE_KEY } from 'helpers/theme';
import { palette } from 'styles/tokens';

type Theme = 'dark' | 'light';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>('dark');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
		if (savedTheme) {
			setTheme(savedTheme);
		}
	}, []);

	useEffect(() => {
		// Before the saved theme is read, `theme` is the server default; writing
		// it would undo themeScript and flash a light-theme visitor dark.
		if (!mounted) return;
		document.documentElement.setAttribute('data-theme', theme);
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute('content', theme === 'dark' ? palette.ink : palette.paper);
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	}, [theme, mounted]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
