import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ThemedImage from './ThemedImage';

const LIGHT = 'https://images.ctfassets.net/s/light.png';
const DARK = 'https://images.ctfassets.net/s/dark.png';

const sources = (container: HTMLElement) =>
	Array.from(container.querySelectorAll('img')).map((img) => ({
		src: decodeURIComponent(img.getAttribute('src') ?? ''),
		loading: img.getAttribute('loading'),
		fetchPriority: img.getAttribute('fetchpriority'),
	}));

describe('ThemedImage', () => {
	it('renders one image when there is no dark variant', () => {
		const { container } = render(
			<ThemedImage src={LIGHT} alt="" fill sizes="100vw" />
		);
		const imgs = sources(container);
		expect(imgs).toHaveLength(1);
		expect(imgs[0].src).toContain('light.png');
	});

	it('renders both variants and only prioritises the dark one', () => {
		const { container } = render(
			<ThemedImage
				src={LIGHT}
				srcDark={DARK}
				alt=""
				fill
				sizes="100vw"
				priority
				fetchPriority="high"
			/>
		);
		const [dark, light] = sources(container);
		expect(dark.src).toContain('dark.png');
		expect(dark.fetchPriority).toBe('high');
		expect(light.src).toContain('light.png');
		expect(light.loading).toBe('lazy');
		expect(light.fetchPriority).toBeNull();
	});
});
