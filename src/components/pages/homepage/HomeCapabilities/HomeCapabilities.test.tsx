import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ServiceItem } from 'types/service';

import HomeCapabilities from './HomeCapabilities';

const capability = (title: string, list: string[]): ServiceItem => ({
	__typename: 'Section',
	contentsCollection: {
		items: [
			{ title, subTitle: `${title} description`, list: [] },
			{ title: '', subTitle: '', list },
		],
	},
});

describe('HomeCapabilities', () => {
	it('renders one column per Contentful sub-section and skips the header entry', () => {
		const header = { __typename: 'Title' } as unknown as ServiceItem;
		render(
			<HomeCapabilities
				data={{ title: 'What I do.', subTitle: 'Lede' }}
				services={[
					header,
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
		const firstColumn = headings[0].closest('li') as HTMLElement;
		expect(
			within(firstColumn)
				.getAllByRole('listitem')
				.map((li) => li.textContent)
		).toEqual(['Web', 'APIs']);
	});

	it('renders nothing without capabilities', () => {
		const { container } = render(<HomeCapabilities services={[]} />);
		expect(container).toBeEmptyDOMElement();
	});
});
