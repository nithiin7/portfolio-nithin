import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NotFound, { closestRoute } from './NotFound';

const routes = [
	{ title: 'Home', href: '/' },
	{ title: 'Work', href: '/#portfolio' },
	{ title: 'Blog', href: '/blog' },
	{ title: 'Stats', href: '/stats' },
];

describe('closestRoute', () => {
	it('matches on the first path segment in either direction', () => {
		expect(closestRoute('/blogs/x', routes)).toBe(2);
		expect(closestRoute('/stat', routes)).toBe(3);
		expect(closestRoute('/portfolio/9', routes)).toBe(1);
	});

	it('returns -1 for the root and for unrelated paths', () => {
		expect(closestRoute('/', routes)).toBe(-1);
		expect(closestRoute('/zzz', routes)).toBe(-1);
	});
});

describe('NotFound', () => {
	it('shows the missing path and flags the closest existing page', () => {
		window.history.pushState({}, '', '/blogs/old-post');
		render(<NotFound />);
		expect(screen.getByText('/blogs/old-post')).toBeInTheDocument();
		const nav = screen.getByRole('navigation', { name: 'Pages that exist' });
		const blog = within(nav).getByRole('link', { name: /Blog/ });
		expect(blog).toHaveTextContent('Closest match');
		expect(within(nav).getAllByText('Closest match')).toHaveLength(1);
	});
});
