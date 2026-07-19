const required = (name: string, value: string | undefined): string => {
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
};

// NEXT_PUBLIC_ values must stay literal process.env.X expressions — Next.js
// inlines them into the client bundle by static replacement, so dynamic
// process.env[name] lookups resolve to undefined in the browser.
export const clientEnv = {
	NEXT_PUBLIC_SUPABASE_URL: required(
		'NEXT_PUBLIC_SUPABASE_URL',
		process.env.NEXT_PUBLIC_SUPABASE_URL
	),
	NEXT_PUBLIC_SUPABASE_ANON_KEY: required(
		'NEXT_PUBLIC_SUPABASE_ANON_KEY',
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	),
	NEXT_PUBLIC_RECAPTCHA_SITE_KEY: required(
		'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
		process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
	),
	NEXT_PUBLIC_SERVICE_ID: required(
		'NEXT_PUBLIC_SERVICE_ID',
		process.env.NEXT_PUBLIC_SERVICE_ID
	),
	NEXT_PUBLIC_TEMPLATE_ID: required(
		'NEXT_PUBLIC_TEMPLATE_ID',
		process.env.NEXT_PUBLIC_TEMPLATE_ID
	),
	NEXT_PUBLIC_EMAILJS_ID: required(
		'NEXT_PUBLIC_EMAILJS_ID',
		process.env.NEXT_PUBLIC_EMAILJS_ID
	),
};

// Getters defer the reads: server-only vars don't exist in the client bundle,
// so eager asserts here would crash any client module importing clientEnv.
// Server modules touch these at import time, which still fails `next build`
// during static generation when a var is missing.
export const serverEnv = {
	get CONTENTFUL_SPACE_ID(): string {
		return required('CONTENTFUL_SPACE_ID', process.env.CONTENTFUL_SPACE_ID);
	},
	get CONTENTFUL_ENVIRONMENT(): string {
		return required(
			'CONTENTFUL_ENVIRONMENT',
			process.env.CONTENTFUL_ENVIRONMENT
		);
	},
	get CONTENTFUL_VERSION(): string {
		return required('CONTENTFUL_VERSION', process.env.CONTENTFUL_VERSION);
	},
	get CONTENTFUL_ACCESS_TOKEN(): string {
		return required(
			'CONTENTFUL_ACCESS_TOKEN',
			process.env.CONTENTFUL_ACCESS_TOKEN
		);
	},
};
