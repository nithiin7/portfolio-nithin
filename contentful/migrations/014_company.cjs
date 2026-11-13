/**
 * Company: one record per organisation (name, logo, website) shared by
 * Career, Testimonials and Collaborations. Expand only: Link.logo and
 * Career Role.company stay as deprecated fields until a contract migration.
 */
const {
	SLUG,
	HTTPS,
	size,
	regexp,
	control,
	internalName,
	imageLink,
	entryLink,
	deprecateField,
} = require('../lib/schema.cjs');

const ITEM_TYPES = [
	'portfolioDetails',
	'capability',
	'careerExperience',
	'certification',
	'testimonialCard',
	'principle',
	'link',
	'company',
];

module.exports = function (migration) {
	const company = migration.createContentType('company', {
		name: 'Company',
		description:
			'An organisation and its logo, shown in Career, Testimonials and Collaborations.',
	});
	internalName(company, 'Company — EY');
	company.displayField('internalName');

	company
		.createField('name')
		.name('Name')
		.type('Symbol')
		.required(true)
		.validations([size(60)]);
	control(
		company,
		'name',
		'singleLine',
		'Official name, e.g. "Paytm Payments Bank". Screen readers hear it as the logo\'s label, and it is shown in mono type when there is no logo.'
	);

	company
		.createField('slug')
		.name('Slug')
		.type('Symbol')
		.required(true)
		.validations([
			{ unique: true },
			size(60, 2),
			regexp(SLUG, 'Lower-case kebab-case, e.g. "paytm-payments-bank".'),
		]);
	control(
		company,
		'slug',
		'slugEditor',
		'Stable key, e.g. "paytm-payments-bank". Also the logo file name: company-<slug>--logo.svg.',
		{ trackingFieldId: 'name' }
	);

	imageLink(company.createField('logo').name('Logo').required(true));
	control(
		company,
		'logo',
		'assetLinkEditor',
		'Single-colour SVG, transparent background, trimmed to the mark. Under 20 KB, with a viewBox. Rendered as a mask in the theme colour.'
	);

	company
		.createField('websiteUrl')
		.name('Website URL')
		.type('Symbol')
		.validations([regexp(HTTPS, 'An https:// URL.')]);
	control(
		company,
		'websiteUrl',
		'urlEditor',
		'Optional. Where the logo links to (opens in a new tab).'
	);

	company
		.createField('showLogo')
		.name('Show logo')
		.type('Boolean')
		.required(true)
		.defaultValue({ 'en-US': true });
	control(
		company,
		'showLogo',
		'boolean',
		"No = print the name in mono type instead of the logo (for marks that don't read at small sizes).",
		{ trueLabel: 'Yes', falseLabel: 'No' }
	);

	// Career Role already has a text `company`, and a field can't change type,
	// so the reference is `employer`.
	const role = migration.editContentType('careerExperience');
	entryLink(role.createField('employer').name('Employer').required(true), [
		'company',
	]);
	control(
		role,
		'employer',
		'entryLinkEditor',
		'The Company entry. Its name and logo are shown on the role.'
	);
	role.moveField('employer').afterField('title');
	deprecateField(role, 'company', 'Company (text)');
	control(
		role,
		'company',
		'singleLine',
		'Deprecated: replaced by Employer. Removed at the next contract.'
	);
	role.moveField('company').toTheBottom();

	const quote = migration.editContentType('testimonialCard');
	entryLink(quote.createField('company').name('Company'), ['company']);
	control(
		quote,
		'company',
		'entryLinkEditor',
		"Optional. Adds the company's logo to the card. Organisation is still the text shown under the name."
	);
	quote.moveField('company').afterField('organisation');

	const section = migration.editContentType('section');
	section.editField('items').items({
		type: 'Link',
		linkType: 'Entry',
		validations: [{ linkContentType: ITEM_TYPES }],
	});

	const link = migration.editContentType('link');
	deprecateField(link, 'logo', 'Logo');
	control(
		link,
		'logo',
		'assetLinkEditor',
		'Deprecated: collaborators are Company entries now. Removed at the next contract.'
	);
};
