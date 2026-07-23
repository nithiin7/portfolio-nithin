import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Tag from './Tag';

describe('Tag', () => {
	it('renders children', () => {
		render(<Tag>React</Tag>);

		expect(screen.getByText('React')).toBeInTheDocument();
	});

	it('applies variant and size classes', () => {
		render(
			<Tag variant="primary" size="large">
				Node
			</Tag>
		);

		const className = screen.getByText('Node').className;
		expect(className).toMatch(/Tag__primary/);
		expect(className).toMatch(/Tag__large/);
	});

	it('renders a plain span when animated is false', () => {
		render(<Tag animated={false}>Static</Tag>);

		const el = screen.getByText('Static');
		expect(el.tagName).toBe('SPAN');
	});
});
