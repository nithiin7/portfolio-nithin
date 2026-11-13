const required = (name: string, value: string | undefined): string => {
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
};

const optional = (value: string | undefined): string | undefined =>
	value || undefined;

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
	/** Unset: GTM isn't loaded. */
	get NEXT_PUBLIC_GOOGLE_GTM_ID(): string | undefined {
		return optional(process.env.NEXT_PUBLIC_GOOGLE_GTM_ID);
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
	/** `true` reads drafts through the Preview API (CMS checks, previews). */
	get CONTENTFUL_PREVIEW(): boolean {
		return process.env.CONTENTFUL_PREVIEW === 'true';
	},
	get CONTENTFUL_PREVIEW_ACCESS_TOKEN(): string {
		return required(
			'CONTENTFUL_PREVIEW_ACCESS_TOKEN',
			process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
		);
	},
	/** Shared secret the Contentful webhook sends to /api/revalidate. */
	get CONTENTFUL_REVALIDATE_SECRET(): string | undefined {
		return optional(process.env.CONTENTFUL_REVALIDATE_SECRET);
	},
	/** Unset in local dev: comments then fail verification and /api/ask skips it. */
	get RECAPTCHA_SECRET_KEY(): string | undefined {
		return optional(process.env.RECAPTCHA_SECRET_KEY);
	},
	/** Unset: /api/ask answers 503. */
	get OPENAI_API_KEY(): string | undefined {
		return optional(process.env.OPENAI_API_KEY);
	},
	/** Unset: the WakaTime card is hidden on /stats. */
	get WAKATIME_API_KEY(): string | undefined {
		return optional(process.env.WAKATIME_API_KEY);
	},
	/** Needed to read the private HF Space status on /stats. */
	get HUGGINGFACE_TOKEN(): string | undefined {
		return optional(process.env.HUGGINGFACE_TOKEN);
	},
};

type EnvSource = Record<string, string | undefined>;

// Without these no page can render, so the server refuses to start.
const CONTENT_VARS = [
	'CONTENTFUL_SPACE_ID',
	'CONTENTFUL_ENVIRONMENT',
	'CONTENTFUL_VERSION',
	'CONTENTFUL_ACCESS_TOKEN',
];

// Each powers one feature (comments, contact form, reCAPTCHA); the getters
// above still throw where they're used.
const FEATURE_VARS = [
	'NEXT_PUBLIC_SUPABASE_URL',
	'NEXT_PUBLIC_SUPABASE_ANON_KEY',
	'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
	'NEXT_PUBLIC_SERVICE_ID',
	'NEXT_PUBLIC_TEMPLATE_ID',
	'NEXT_PUBLIC_EMAILJS_ID',
];

/** Required variables that are unset, split by how badly their absence hurts. */
export const missingEnv = (
	env: EnvSource = process.env
): { content: string[]; features: string[] } => ({
	content: [
		...CONTENT_VARS,
		...(env.CONTENTFUL_PREVIEW === 'true'
			? ['CONTENTFUL_PREVIEW_ACCESS_TOKEN']
			: []),
	].filter((name) => !env[name]),
	features: FEATURE_VARS.filter((name) => !env[name]),
});

/**
 * Startup check (instrumentation `register`): throws one error naming every
 * missing content variable, and logs the missing feature variables.
 */
export const assertEnv = (env: EnvSource = process.env): void => {
	const { content, features } = missingEnv(env);
	if (features.length > 0) {
		console.error(
			`Missing environment variables (features will fail): ${features.join(', ')}. See .env.example.`
		);
	}
	if (content.length > 0) {
		throw new Error(
			`Missing required environment variables: ${content.join(', ')}. See .env.example.`
		);
	}
};
