import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Capability } from 'types/home';

import HomeCapabilities from './HomeCapabilities';

const capability = (title: string, items: string[]): Capability => ({
	title,
	summary: `${title} description`,
	items,
});

describe('HomeCapabilities', () => {
	it('renders one column per Contentful capability, in order', () => {
		render(
			<HomeCapabilities
				data={{ title: 'What I do.', subTitle: 'Lede' }}
				capabilities={[
					capability('Fullstack', ['Web', 'APIs']),
					capability('AI Systems', ['Agents']),
				]}
			/>
		);

		const headings = screen.getAllByRole('heading', { level: 3 });
		expect(headings.map((h) => h.textContent)).toEqual([
			'Fullstack',
			'AI Systems',
		]);
		const firstColumn = headings[0]!.closest('li') as HTMLElement;
		expect(
			within(firstColumn)
				.getAllByRole('listitem')
				.map((li) => li.textContent)
		).toEqual(['Web', 'APIs']);
	});

	it('renders nothing without capabilities', () => {
		const { container } = render(<HomeCapabilities capabilities={[]} />);
		expect(container).toBeEmptyDOMElement();
	});
});
