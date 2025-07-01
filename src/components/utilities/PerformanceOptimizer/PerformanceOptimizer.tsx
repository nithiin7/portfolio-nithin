'use client';
import { useEffect } from 'react';

const PerformanceOptimizer: React.FC = () => {
	useEffect(() => {
		const preloadLinks = [
			{ rel: 'preload', href: '/opengraph-image.jpeg', as: 'image' },
			{ rel: 'preload', href: '/favicon.ico', as: 'image' },
		];

		preloadLinks.forEach(({ rel, href, as }) => {
			const link = document.createElement('link');
			link.rel = rel;
			link.href = href;
			if (as) link.setAttribute('as', as);
			document.head.appendChild(link);
		});

		const resourceHints = [
			{ rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
			{ rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
			{ rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
			{ rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
		];

		resourceHints.forEach(({ rel, href }) => {
			const link = document.createElement('link');
			link.rel = rel;
			link.href = href;
			document.head.appendChild(link);
		});

		const images = document.querySelectorAll('img');
		images.forEach((img) => {
			if (!img.loading) {
				img.loading = 'lazy';
			}
			if (!img.decoding) {
				img.decoding = 'async';
			}
		});

		if ('IntersectionObserver' in window) {
			const imageObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target as HTMLImageElement;
						if (img.dataset.src) {
							img.src = img.dataset.src;
							img.removeAttribute('data-src');
							imageObserver.unobserve(img);
						}
					}
				});
			});

			document.querySelectorAll('img[data-src]').forEach((img) => {
				imageObserver.observe(img);
			});
		}
	}, []);

	return null;
};

export default PerformanceOptimizer;
