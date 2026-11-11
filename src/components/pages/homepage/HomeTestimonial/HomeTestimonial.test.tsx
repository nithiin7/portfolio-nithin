import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Testimonial } from 'types/testimony';

import HomeTestimonial from './HomeTestimonial';

const testimonial = (id: number, reviewer: string): Testimonial => ({
	id,
	review: `${reviewer} says hello`,
	avatar: { url: '' },
	reviewer,
	institution: `${reviewer} Institute`,
});

const items = [
	testimonial(1, 'Ada'),
	testimonial(2, 'Grace'),
	testimonial(3, 'Linus'),
];

const activeSlide = () =>
	screen.getByRole('group', { name: /of 3$/ }) as HTMLElement;

describe('HomeTestimonial', () => {
	it('shows one quote at a time with its author', () => {
		render(<HomeTestimonial testimonial={items} />);

		const slide = activeSlide();
		expect(slide).toHaveAccessibleName('1 of 3');
		expect(within(slide).getByText('Ada says hello')).toBeInTheDocument();
		expect(within(slide).getByText('Ada Institute')).toBeInTheDocument();
		expect(screen.getAllByRole('group')).toHaveLength(1);
	});

	it('wraps around with the arrow buttons and keys', () => {
		render(<HomeTestimonial testimonial={items} />);

		fireEvent.click(
			screen.getByRole('button', { name: 'Previous testimonial' })
		);
		expect(screen.getByRole('group', { name: '3 of 3' })).toBeInTheDocument();

		fireEvent.keyDown(
			screen.getByRole('button', { name: 'Next testimonial' }),
			{ key: 'ArrowRight' }
		);
		expect(screen.getByRole('group', { name: '1 of 3' })).toBeInTheDocument();
	});

	it('jumps to a page and marks it current', () => {
		render(<HomeTestimonial testimonial={items} />);

		const page = screen.getByRole('button', {
			name: /Testimonial\s*02/,
		});
		fireEvent.click(page);

		expect(page).toHaveAttribute('aria-current', 'true');
		expect(screen.getByRole('group', { name: '2 of 3' })).toBeInTheDocument();
	});

	it('hides controls for a single testimonial and renders nothing when empty', () => {
		const { rerender, container } = render(
			<HomeTestimonial testimonial={[items[0]]} />
		);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();

		rerender(<HomeTestimonial testimonial={[]} />);
		expect(container).toBeEmptyDOMElement();
	});
});
