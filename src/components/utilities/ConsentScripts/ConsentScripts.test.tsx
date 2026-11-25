import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConsentProvider } from 'contexts/ConsentContext';
import { CONSENT_STORAGE_KEY } from 'helpers/consent';

import ConsentScripts from './ConsentScripts';

vi.mock('@vercel/analytics/next', () => ({
	Analytics: () => <i data-testid="vercel-analytics" />,
}));
vi.mock('@vercel/speed-insights/next', () => ({
	SpeedInsights: () => <i data-testid="speed-insights" />,
}));
vi.mock('next/script', () => ({
	default: ({ id }: { id: string }) => <i data-testid={`script-${id}`} />,
}));

const renderScripts = () =>
	render(
		<ConsentProvider>
			<ConsentScripts gtmId="GTM-TEST" vercel />
		</ConsentProvider>
	);

describe('ConsentScripts', () => {
	beforeEach(() => localStorage.clear());

	it('loads nothing before the visitor opts in', () => {
		const { container } = renderScripts();
		expect(container).toBeEmptyDOMElement();
	});

	it('loads nothing after the visitor declines', () => {
		localStorage.setItem(
			CONSENT_STORAGE_KEY,
			JSON.stringify({ v: 1, ts: Date.now(), analytics: false })
		);
		const { container } = renderScripts();
		expect(container).toBeEmptyDOMElement();
	});

	it('loads GTM and Vercel analytics once the visitor opts in', () => {
		localStorage.setItem(
			CONSENT_STORAGE_KEY,
			JSON.stringify({ v: 1, ts: Date.now(), analytics: true })
		);
		const { getByTestId } = renderScripts();
		expect(getByTestId('script-gtm')).toBeInTheDocument();
		expect(getByTestId('vercel-analytics')).toBeInTheDocument();
		expect(getByTestId('speed-insights')).toBeInTheDocument();
	});
});
