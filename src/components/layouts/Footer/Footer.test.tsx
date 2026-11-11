import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Footer from './Footer';

const { pathname, lenis } = vi.hoisted(() => ({
	pathname: { current: '/' },
	lenis: { scrollTo: vi.fn() },
}));

vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }));
vi.mock('lenis/react', () => ({ useLenis: () => lenis }));

describe('Footer', () => {
	beforeEach(() => {
		pathname.current = '/';
		lenis.scrollTo.mockReset();
	});

	it('opens with the GET IN TOUCH CTA whose O links to /contact', () => {
		render(<Footer />);

		expect(
			screen.getByRole('heading', { level: 2, name: 'Get in touch' })
		).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /let’s talk/i })).toHaveAttribute(
			'href',
			'/contact'
		);
		expect(
			screen.getByRole('button', { name: /nithinp150@gmail.com/ })
		).toBeInTheDocument();
		expect(
			screen.getByRole('navigation', { name: 'Social profiles' })
		).toBeInTheDocument();
	});

	it('drops the CTA and details on /contact, which already shows them', () => {
		pathname.current = '/contact';
		render(<Footer />);

		expect(
			screen.queryByRole('heading', { name: 'Get in touch' })
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole('navigation', { name: 'Social profiles' })
		).not.toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /back to top/i })
		).toBeInTheDocument();
	});

	it('scrolls to the top and moves focus to the main content', () => {
		const main = document.createElement('main');
		main.id = 'main-content';
		main.tabIndex = -1;
		document.body.appendChild(main);
		render(<Footer />);

		fireEvent.click(screen.getByRole('button', { name: /back to top/i }));

		expect(lenis.scrollTo).toHaveBeenCalledWith(0, { immediate: false });
		expect(main).toHaveFocus();
		main.remove();
	});
});
