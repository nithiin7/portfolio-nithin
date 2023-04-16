/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		NEXT_PUBLIC_SPACE_ID: '3tceq0itz5kj',
		NEXT_PUBLIC_VERSION: 'v1',
		NEXT_PUBLIC_ENVIRONMENT: 'master',
		NEXT_PUBLIC_AUTHORIZATION_TOKEN:
			'EoivlAc4VSaHS3gkCNXTYB--HKkf3gSKBR8nn_NY5DA',
		SERVICE_ID: 'service_hh0l7yp',
		TEMPLATE_ID: 'template_va5jl1g',
		EMAILJS_ID: 'g4AdPHbp-OKcLJaca',
	},
	images: {
		domains: ['images.ctfassets.net'],
	},
	webpack(config) {
		config.module.rules.push({
		  test: /\.pdf$/,
		  use: [
			{
			  loader: 'file-loader',
			  options: {
				name: '[name].[ext]',
				publicPath: '/_next/static/files',
				outputPath: 'static/files',
			  },
			},
		  ],
		});
		return config;
	},
};

module.exports = nextConfig;
