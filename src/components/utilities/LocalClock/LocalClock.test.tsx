import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LocalClock from './LocalClock';

describe('LocalClock', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-11-11T08:30:05Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders the time in the given zone, not the host zone', () => {
		render(<LocalClock timeZone="Asia/Kolkata" zoneLabel="IST" />);

		expect(screen.getByText('14:00:05')).toBeInTheDocument();
		expect(screen.getByText(/IST/)).toBeInTheDocument();
	});

	it('ticks every second', () => {
		render(<LocalClock timeZone="Asia/Kolkata" />);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(screen.getByText('14:00:06')).toBeInTheDocument();
	});

	it('omits seconds when asked', () => {
		render(<LocalClock timeZone="Asia/Kolkata" showSeconds={false} />);

		expect(screen.getByText('14:00')).toBeInTheDocument();
	});
});
