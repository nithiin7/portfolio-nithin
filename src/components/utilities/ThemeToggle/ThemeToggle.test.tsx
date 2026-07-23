import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ThemeProvider } from 'contexts/ThemeContext';

import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it('starts in dark mode and offers to switch to light', () => {
		render(
			<ThemeProvider>
				<ThemeToggle />
			</ThemeProvider>
		);

		expect(
			screen.getByRole('button', { name: /switch to light mode/i })
		).toBeInTheDocument();
	});

	it('toggles the theme and label on click', () => {
		render(
			<ThemeProvider>
				<ThemeToggle />
			</ThemeProvider>
		);

		fireEvent.click(
			screen.getByRole('button', { name: /switch to light mode/i })
		);

		expect(
			screen.getByRole('button', { name: /switch to dark mode/i })
		).toBeInTheDocument();
		expect(document.documentElement).toHaveAttribute('data-theme', 'light');
	});
});
