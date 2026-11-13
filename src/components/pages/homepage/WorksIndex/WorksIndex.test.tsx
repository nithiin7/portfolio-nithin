import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { PortfolioItem } from 'types/portfolio';

import WorksIndex from './WorksIndex';

// ViewTransition only ships in the React canary bundled by Next, not the npm build vitest resolves
vi.mock('react', async (importOriginal) => ({
	...(await importOriginal<typeof import('react')>()),
	ViewTransition: ({ children }: { children: ReactNode }) => children,
}));

const projects: PortfolioItem[] = [4, 5, 6].map((id) => ({
	id,
	slug: `project-${id}`,
	title: `Project ${id}`,
	year: '2025',
	tech: ['Next.js'],
	image: { url: `https://images.ctfassets.net/s/${id}/img.png` },
}));

const rows = (): HTMLAnchorElement[] => screen.getAllByRole('link');

describe('WorksIndex', () => {
	it('links rows by Contentful id and continues numbering after the featured cards', () => {
		render(<WorksIndex projects={projects} offset={3} />);
		expect(rows().map((a) => a.getAttribute('href'))).toEqual([
			'/portfolio/project-4',
			'/portfolio/project-5',
			'/portfolio/project-6',
		]);
		expect(rows()[0]!.textContent).toContain('04');
	});

	it('exposes a single tab stop and moves it with the arrow keys', () => {
		render(<WorksIndex projects={projects} />);
		expect(rows().map((a) => a.tabIndex)).toEqual([0, -1, -1]);

		rows()[0]!.focus();
		fireEvent.keyDown(rows()[0]!, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(rows()[1]);
		expect(rows().map((a) => a.tabIndex)).toEqual([-1, 0, -1]);

		fireEvent.keyDown(rows()[1]!, { key: 'End' });
		expect(document.activeElement).toBe(rows()[2]);

		fireEvent.keyDown(rows()[2]!, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(rows()[0]);

		fireEvent.keyDown(rows()[0]!, { key: 'ArrowUp' });
		expect(document.activeElement).toBe(rows()[2]);
	});

	it('hides the type column when no project has a type', () => {
		const { container } = render(<WorksIndex projects={projects} />);
		expect(container.firstElementChild?.getAttribute('data-has-type')).toBe(
			'false'
		);
	});
});
