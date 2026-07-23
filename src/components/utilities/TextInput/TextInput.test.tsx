import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TextInput from './TextInput';

describe('TextInput', () => {
	it('renders a label and placeholder', () => {
		render(
			<TextInput name="email" label="Email" placeholder="you@example.com" />
		);

		expect(screen.getByLabelText('Email')).toHaveAttribute(
			'placeholder',
			'you@example.com'
		);
	});

	it('calls onChange when typed into', () => {
		const onChange = vi.fn();
		render(<TextInput name="email" label="Email" onChange={onChange} />);

		fireEvent.change(screen.getByLabelText('Email'), {
			target: { value: 'a@b.com' },
		});

		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('shows validation errors with an alert role', () => {
		render(
			<TextInput name="email" label="Email" errors={['Email is required']} />
		);

		const alert = screen.getByRole('alert');
		expect(alert).toHaveTextContent('Email is required');
		expect(screen.getByLabelText('Email')).toHaveAttribute(
			'aria-invalid',
			'true'
		);
	});

	it('renders no error region when there are no errors', () => {
		render(<TextInput name="email" label="Email" />);

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});
});
