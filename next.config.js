/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	env: {
		NEXT_PUBLIC_SPACE_ID: '3tceq0itz5kj',
		NEXT_PUBLIC_VERSION: 'v1',
		NEXT_PUBLIC_ENVIRONMENT: 'master',
		NEXT_PUBLIC_AUTHORIZATION_TOKEN:
			'EoivlAc4VSaHS3gkCNXTYB--HKkf3gSKBR8nn_NY5DA',
		NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: 'G-E4KM0WS03X',
		NEXT_PUBLIC_SERVICE_ID: 'service_hh0l7yp',
		NEXT_PUBLIC_TEMPLATE_ID: 'template_va5jl1g',
		NEXT_PUBLIC_EMAILJS_ID: 'g4AdPHbp-OKcLJaca',
	},
	images: {
		domains: ['images.ctfassets.net'],
	},
};

module.exports = nextConfig;
