/**
 * Shared field helpers for migrations. Keep validations here so every type
 * applies the same rules (docs/cms/CONVENTIONS.md §3).
 */
const SLUG = '^[a-z0-9]+(?:-[a-z0-9]+)*$';
const HTTPS = '^https://[^\\s]+$';
const URL_OR_PATH = '^(https://[^\\s]+|mailto:[^\\s]+|/[^\\s]*)$';
const INTERNAL_NAME = '^(Project|Post|Role|Cert|Testimonial|Home|Page|SEO|Link|Media|Person|Category|Capability|Principle|Stat|Collaborator|Site) — .{2,80}$';

const RICH_TEXT = [
	{ enabledMarks: ['bold', 'italic', 'code'], message: 'Bold, italic and code only.' },
	{
		enabledNodeTypes: [
			'heading-2', 'heading-3', 'heading-4', 'ordered-list', 'unordered-list',
			'hr', 'blockquote', 'embedded-asset-block', 'hyperlink',
		],
		message: 'H2–H4, lists, quote, rule, links and images only. The page title is the only H1.',
	},
	{ nodes: {} },
];

const size = (max, min) => ({ size: { ...(min ? { min } : {}), max } });
const regexp = (pattern, message) => ({ regexp: { pattern }, ...(message ? { message } : {}) });

/** Apply a builtin editor control with help text. */
const dateOnly = (type, id, helpText) =>
	type.changeFieldControl(id, 'builtin', 'datePicker', { helpText, format: 'dateonly' });

const control = (type, id, widgetId, helpText, settings = {}) =>
	type.changeFieldControl(id, 'builtin', widgetId, { helpText, ...settings });

const internalName = (type, example) => {
	type.createField('internalName').name('Internal name').type('Symbol').required(true)
		.validations([{ unique: true }, regexp(INTERNAL_NAME, 'Format: "<Type> — <Name>", e.g. "' + example + '".')]);
	control(type, 'internalName', 'singleLine', `Never shown on the site. Format "<Type> — <Name>", e.g. "${example}".`);
};

const slug = (type, trackingFieldId, where) => {
	type.createField('slug').name('Slug').type('Symbol').required(true)
		.validations([{ unique: true }, regexp(SLUG, 'Lowercase words joined by hyphens.'), size(60, 3)]);
	control(type, 'slug', 'slugEditor', `URL segment for ${where}. Lowercase, hyphenated, no type prefix. Don't change it once published.`, { trackingFieldId });
};

const imageLink = (field, dimensions) =>
	field.type('Link').linkType('Asset').validations([
		{ linkMimetypeGroup: ['image'] },
		...(dimensions ? [{ assetImageDimensions: dimensions }] : []),
	]);

const entryLink = (field, types) =>
	field.type('Link').linkType('Entry').validations([{ linkContentType: types }]);

const entryLinks = (field, types, max) =>
	field.type('Array').items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: types }] })
		.validations(max ? [size(max)] : []);

const symbols = (field, max, itemMax) =>
	field.type('Array').items({ type: 'Symbol', validations: [size(itemMax)] }).validations([size(max)]);

/**
 * Rename a field for display, disable it in the editor and make it optional
 * (a required disabled field would block publishing), keeping the data.
 */
const deprecateField = (type, id, label) => {
	type.editField(id).name(`[Deprecated] ${label}`).disabled(true).required(false);
};

module.exports = {
	SLUG, HTTPS, URL_OR_PATH, RICH_TEXT, size, regexp, control, dateOnly, internalName, slug,
	imageLink, entryLink, entryLinks, symbols, deprecateField,
};
