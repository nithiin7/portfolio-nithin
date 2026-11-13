import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Company } from 'types/company';

import CompanyLogo, { opticalScale } from './CompanyLogo';

const company = (overrides: Partial<Company> = {}): Company => ({
	name: 'Paytm Payments Bank',
	slug: 'paytm-payments-bank',
	logoUrl: 'https://images.ctfassets.net/s/paytm.svg',
	ratio: 4,
	showLogo: true,
	url: 'https://www.paytmbank.com/',
	...overrides,
});

describe('CompanyLogo', () => {
	it('draws the logo as a mask labelled with the company name', () => {
		render(<CompanyLogo company={company()} />);

		const logo = screen.getByRole('img', { name: 'Paytm Payments Bank' });
		expect(logo.getAttribute('style')).toContain(
			'url("https://images.ctfassets.net/s/paytm.svg")'
		);
		expect(screen.queryByText('Paytm Payments Bank')).not.toBeInTheDocument();
	});

	it('prints the name instead when showLogo is off', () => {
		render(<CompanyLogo company={company({ showLogo: false })} />);

		expect(screen.getByText('Paytm Payments Bank')).toBeVisible();
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});

	it('prints the name instead when the logo is missing', () => {
		render(<CompanyLogo company={company({ logoUrl: undefined })} />);

		expect(screen.getByText('Paytm Payments Bank')).toBeInTheDocument();
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});

	it('links to the website in a new tab with an accessible label', () => {
		render(<CompanyLogo company={company()} linked />);

		const link = screen.getByRole('link', {
			name: 'Paytm Payments Bank (opens in a new tab)',
		});
		expect(link).toHaveAttribute('href', 'https://www.paytmbank.com/');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});

	it('labels a linked name fallback through the link only', () => {
		render(<CompanyLogo company={company({ showLogo: false })} linked />);

		const link = screen.getByRole('link');
		expect(link).toHaveAccessibleName(
			'Paytm Payments Bank (opens in a new tab)'
		);
		expect(screen.getByText('Paytm Payments Bank')).toHaveAttribute(
			'aria-hidden',
			'true'
		);
	});

	it('renders no link without a website, or unless asked', () => {
		const { rerender } = render(
			<CompanyLogo company={company({ url: undefined })} linked />
		);
		expect(screen.queryByRole('link')).not.toBeInTheDocument();

		rerender(<CompanyLogo company={company()} />);
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('hides a decorative logo from assistive tech', () => {
		const { container } = render(
			<CompanyLogo company={company()} decorative />
		);

		expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});

	it('passes tabIndex to the link for duplicated marquee copies', () => {
		render(<CompanyLogo company={company()} linked tabIndex={-1} />);

		expect(screen.getByRole('link')).toHaveAttribute('tabindex', '-1');
	});
});

describe('opticalScale', () => {
	it('keeps square marks at full height', () => {
		expect(opticalScale(1)).toBe(1);
	});

	it('shrinks wide wordmarks and grows tall marks, within bounds', () => {
		expect(opticalScale(4)).toBeLessThan(1);
		expect(opticalScale(0.66)).toBeGreaterThan(1);
		expect(opticalScale(1000)).toBe(0.5);
		expect(opticalScale(0.001)).toBe(1.25);
	});
});
