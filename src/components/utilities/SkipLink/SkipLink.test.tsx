import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkipLink from './SkipLink';

describe('SkipLink', () => {
	it('links to the given target id', () => {
		render(<SkipLink targetId="main-content" />);

		expect(
			screen.getByRole('link', { name: /skip to content/i })
		).toHaveAttribute('href', '#main-content');
	});
});
