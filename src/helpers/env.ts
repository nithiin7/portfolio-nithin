const required = (name: string, value: string | undefined): string => {
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
};

export const clientEnv = {
	get NEXT_PUBLIC_SUPABASE_URL(): string {
		return required(
			'NEXT_PUBLIC_SUPABASE_URL',
			process.env.NEXT_PUBLIC_SUPABASE_URL
		);
	},
	get NEXT_PUBLIC_SUPABASE_ANON_KEY(): string {
		return required(
			'NEXT_PUBLIC_SUPABASE_ANON_KEY',
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		);
	},
	get NEXT_PUBLIC_RECAPTCHA_SITE_KEY(): string {
		return required(
			'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
			process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
		);
	},
	get NEXT_PUBLIC_SERVICE_ID(): string {
		return required(
			'NEXT_PUBLIC_SERVICE_ID',
			process.env.NEXT_PUBLIC_SERVICE_ID
		);
	},
	get NEXT_PUBLIC_TEMPLATE_ID(): string {
		return required(
			'NEXT_PUBLIC_TEMPLATE_ID',
			process.env.NEXT_PUBLIC_TEMPLATE_ID
		);
	},
	get NEXT_PUBLIC_EMAILJS_ID(): string {
		return required(
			'NEXT_PUBLIC_EMAILJS_ID',
			process.env.NEXT_PUBLIC_EMAILJS_ID
		);
	},
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
