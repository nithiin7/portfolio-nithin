import { act, render, screen } from '@testing-library/react';
import { motionValue } from 'motion/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ScrambleText from './ScrambleText';

const glyphCells = (container: HTMLElement) =>
	container.querySelectorAll('[data-glyph]');

const mockReducedMotion = (reduce: boolean) =>
	vi.spyOn(window, 'matchMedia').mockImplementation(
		(query: string) =>
			({
				matches: reduce && query.includes('reduce'),
				media: query,
				addEventListener: () => {},
				removeEventListener: () => {},
			}) as unknown as MediaQueryList
	);

/** An observer that reports every target as on screen straight away. */
const mockVisible = () =>
	vi.spyOn(window, 'IntersectionObserver').mockImplementation(function (
		this: unknown,
		callback: IntersectionObserverCallback
	) {
		return {
			observe: () =>
				callback(
					[{ isIntersecting: true } as IntersectionObserverEntry],
					this as IntersectionObserver
				),
			disconnect: () => {},
			unobserve: () => {},
			takeRecords: () => [],
		} as unknown as IntersectionObserver;
	} as unknown as typeof IntersectionObserver);

afterEach(() => {
	vi.restoreAllMocks();
});

describe('ScrambleText', () => {
	it('keeps the real text readable once and hides the animated layer', () => {
		const { container } = render(
			<ScrambleText as="h2" text="Selected works." />
		);
		const heading = screen.getByRole('heading', { level: 2 });
		expect(heading).toHaveAccessibleName('Selected works.');
		const layer = container.querySelector('[aria-hidden="true"]');
		expect(layer?.textContent).toBe('Selected works.');
		expect(layer?.querySelectorAll('[data-char]')).toHaveLength(15);
	});

	it('shows the final text straight away under reduced motion', () => {
		mockReducedMotion(true);
		const progress = motionValue(0);
		const { container } = render(
			<ScrambleText mode="scroll" text="guardrails" progress={progress} />
		);
		expect(glyphCells(container)).toHaveLength(0);
		expect(container.firstElementChild).toHaveAttribute('data-state', 'done');
	});

	it('scroll mode paints glyphs before progress reaches 1, then resolves', () => {
		mockReducedMotion(false);
		mockVisible();
		const raf = vi
			.spyOn(window, 'requestAnimationFrame')
			.mockImplementation(() => 1);
		const progress = motionValue(0);
		const { container } = render(
			<ScrambleText mode="scroll" text="MCP servers" progress={progress} />
		);
		// Every visible character starts scrambled; the space never does
		expect(glyphCells(container)).toHaveLength(10);

		const tick = raf.mock.calls.at(-1)?.[0];
		act(() => {
			progress.set(1);
			tick?.(performance.now() + 1000);
		});
		expect(glyphCells(container)).toHaveLength(0);
	});

	it('hover mode leaves the text resolved until hovered', () => {
		mockReducedMotion(false);
		const { container } = render(
			<a href="/x">
				<ScrambleText mode="hover" text="Orbit" />
			</a>
		);
		expect(glyphCells(container)).toHaveLength(0);
		expect(screen.getByRole('link')).toHaveAccessibleName('Orbit');
	});
});
