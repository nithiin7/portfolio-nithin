import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import type { ReactNode } from 'react';
import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

import CommandPalette from './CommandPalette';

const push = vi.fn();
const toggleTheme = vi.fn();
let pathname = '/contact';

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push }),
	usePathname: () => pathname,
}));
vi.mock('contexts/ThemeContext', () => ({
	useTheme: () => ({ theme: 'dark', toggleTheme }),
}));
vi.mock('react-google-recaptcha-v3', () => ({
	GoogleReCaptchaProvider: ({ children }: { children: ReactNode }) => children,
	useGoogleReCaptcha: () => ({ executeRecaptcha: undefined }),
}));

beforeAll(() => {
	MotionGlobalConfig.skipAnimations = true;
	Element.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
	pathname = '/contact';
	push.mockReset();
	toggleTheme.mockReset();
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					blogPosts: [{ title: 'What is MCP', slug: 'what-is-mcp' }],
					portfolioItems: [{ title: 'Orbit', slug: 'orbit' }],
				})
			)
		)
	);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

const openWithShortcut = (modifier: 'metaKey' | 'ctrlKey' = 'metaKey') =>
	fireEvent.keyDown(window, { key: 'k', [modifier]: true });

const input = () => screen.getByRole('combobox');
const options = () => screen.getAllByRole('option');
const selected = () =>
	options().find((option) => option.getAttribute('aria-selected') === 'true');

describe('CommandPalette', () => {
	it.each(['metaKey', 'ctrlKey'] as const)(
		'opens with %s+K, focuses search and loads the index once',
		async (modifier) => {
			render(<CommandPalette resumeUrl="/resume.pdf" />);

			openWithShortcut(modifier);

			expect(
				screen.getByRole('dialog', { name: 'Command palette' })
			).toBeInTheDocument();
			expect(document.activeElement).toBe(input());
			await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
			expect(fetch).toHaveBeenCalledWith('/api/search');
		}
	);

	it('filters commands and content by the query', async () => {
		render(<CommandPalette resumeUrl="/resume.pdf" />);
		openWithShortcut();
		await waitFor(() => expect(fetch).toHaveBeenCalled());

		fireEvent.change(input(), { target: { value: 'orbit' } });
		await waitFor(() =>
			expect(options().some((option) => option.id === 'portfolio-orbit')).toBe(
				true
			)
		);

		const titles = options().map((option) => option.textContent);
		expect(titles.some((title) => title?.includes('Orbit'))).toBe(true);
		expect(titles.some((title) => title?.includes('Contact'))).toBe(false);
	});

	it('moves the selection with the arrow keys and wraps', () => {
		render(<CommandPalette resumeUrl="/resume.pdf" />);
		openWithShortcut();
		const first = selected();

		fireEvent.keyDown(input(), { key: 'ArrowDown' });
		expect(selected()).not.toBe(first);
		expect(input()).toHaveAttribute('aria-activedescendant', selected()?.id);

		fireEvent.keyDown(input(), { key: 'ArrowUp' });
		fireEvent.keyDown(input(), { key: 'ArrowUp' });
		expect(selected()).toBe(options().at(-1));
	});

	it('runs the selected command on Enter', async () => {
		render(<CommandPalette resumeUrl="/resume.pdf" />);
		openWithShortcut();

		fireEvent.change(input(), { target: { value: 'stats' } });
		fireEvent.keyDown(input(), { key: 'Enter' });

		expect(push).toHaveBeenCalledWith('/stats', { scroll: false });
		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		);
	});

	it('toggles the theme without closing', () => {
		render(<CommandPalette resumeUrl="/resume.pdf" />);
		openWithShortcut();

		fireEvent.change(input(), { target: { value: 'theme' } });
		fireEvent.keyDown(input(), { key: 'Enter' });

		expect(toggleTheme).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('closes on Escape and returns focus to what opened it', async () => {
		render(
			<>
				<button type="button">Before</button>
				<CommandPalette resumeUrl="/resume.pdf" />
			</>
		);
		const before = screen.getByRole('button', { name: 'Before' });
		before.focus();
		openWithShortcut();

		fireEvent.keyDown(window, { key: 'Escape' });

		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		);
		expect(document.activeElement).toBe(before);
	});

	it('toggles closed with the shortcut too', async () => {
		render(<CommandPalette resumeUrl="/resume.pdf" />);
		openWithShortcut();
		openWithShortcut();

		await waitFor(() =>
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		);
	});
});
