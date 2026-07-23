import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Button from './Button';

describe('Button', () => {
	it('renders the provided text', () => {
		render(<Button text="Submit" />);

		expect(screen.getAllByText('Submit')[0]).toBeInTheDocument();
	});

	it('applies the variant class', () => {
		render(<Button text="Send" variant="primary" />);

		expect(screen.getByRole('button').className).toMatch(/Button__primary/);
	});

	it('calls onClick when clicked', () => {
		const onClick = vi.fn();
		render(<Button text="Send" onClick={onClick} />);

		fireEvent.click(screen.getByRole('button'));

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
