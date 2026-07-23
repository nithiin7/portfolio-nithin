import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import TagContainer from './TagContainer';

describe('TagContainer', () => {
	it('renders children', () => {
		render(
			<TagContainer>
				<span>Child</span>
			</TagContainer>
		);

		expect(screen.getByText('Child')).toBeInTheDocument();
	});

	it('applies the justifyContent style', () => {
		render(
			<TagContainer justifyContent="center">
				<span>Child</span>
			</TagContainer>
		);

		expect(screen.getByText('Child').parentElement).toHaveStyle({
			justifyContent: 'center',
		});
	});
});
