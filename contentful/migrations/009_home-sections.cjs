/**
 * Section becomes Home Section, addressed by `key` instead of name/position.
 * The nested title/list/section entries it used to hold are deprecated once
 * their content moves into the typed fields. Page gets an SEO link.
 */
const { RICH_TEXT, size, regexp, control, imageLink, entryLink, entryLinks, deprecateField } = require('../lib/schema.cjs');

const KEYS = ['hero', 'work', 'about', 'capabilities', 'career', 'certifications', 'collaborations', 'testimonials'];
const ITEM_TYPES = ['portfolioDetails', 'capability', 'careerExperience', 'certification', 'testimonialCard', 'principle', 'link'];

module.exports = function (migration) {
	const section = migration.editContentType('section', {
		name: 'Home Section',
		description: 'One homepage section, found by its Key. Page "home" sets the order.',
	});
	section.editField('name').name('Internal name');
	control(section, 'name', 'singleLine', 'Never shown. Becomes "Home — <Key>" at launch (the current live site still looks sections up by this name).');

	section.createField('key').name('Key').type('Symbol')
		.validations([{ unique: true }, { in: KEYS }]);
	control(section, 'key', 'dropdown', 'Which section this is. Each key once.');
	section.createField('heading').name('Heading').type('Symbol').validations([size(60)]);
	control(section, 'heading', 'singleLine', 'Section title, sentence case (the design sets its own casing). 60 characters max.');
	section.createField('lede').name('Lede').type('Symbol').validations([size(240)]);
	control(section, 'lede', 'multipleLine', 'Optional sentence under the heading. 240 characters max.');
	section.createField('body').name('Body').type('RichText').validations(RICH_TEXT);
	control(section, 'body', 'richTextEditor', 'Hero: the one-line pitch (italic is rendered as the accent). About: the bio; the first paragraph is the lede.');
	imageLink(section.createField('image').name('Image'));
	control(section, 'image', 'assetLinkEditor', 'About: portrait, 3:4, at least 1500×2000.');
	entryLinks(section.createField('items').name('Items'), ITEM_TYPES, 30);
	control(section, 'items', 'entryLinksEditor', 'Work: projects. Capabilities: capabilities. Career: roles. Certifications: certifications. Testimonials: testimonials. About: principles. Collaborations: links with logos. Order is kept (career sorts by date).');
	entryLinks(section.createField('stats').name('Stats'), ['stat'], 4);
	control(section, 'stats', 'entryLinksEditor', 'About only: hand-entered stats shown after the counted ones.');
	entryLinks(section.createField('ctas').name('Calls to action'), ['link'], 2);
	control(section, 'ctas', 'entryLinksEditor', 'Hero: primary, then secondary.');

	deprecateField(section, 'contents', 'Contents');
	control(section, 'contents', 'entryLinksEditor', 'Deprecated: replaced by Heading, Lede, Items. Removed at launch.');

	section.moveField('key').afterField('name');
	section.moveField('contents').toTheBottom();

	const page = migration.editContentType('page', {
		description: 'A routed page\'s metadata. "home" also lists the homepage sections in order.',
	});
	page.editField('name').name('Internal name')
		.validations([{ unique: true }, regexp('^Page — .{2,80}$', 'Format: "Page — <slug>".')]);
	control(page, 'name', 'singleLine', 'Never shown. Format "Page — <slug>".');
	page.editField('slug').required(true).validations([{ unique: true }, regexp('^[a-z0-9-]+$', 'Lowercase route name.')]);
	control(page, 'slug', 'singleLine', 'Route this entry describes: home, blog, contact.');
	entryLink(page.createField('seo').name('SEO'), ['seo']);
	control(page, 'seo', 'entryLinkEditor', 'Title, description and social image for this route. Home uses Site Settings → Default SEO.');
	page.editField('section').name('Sections')
		.items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['section'] }] });
	control(page, 'section', 'entryLinksEditor', 'Home only: sections in display order.');
	for (const [id, label] of [['title', 'Title'], ['description', 'Description'], ['ogtitle', 'og:title'], ['ogurl', 'og:url']]) {
		deprecateField(page, id, label);
		control(page, id, 'singleLine', 'Deprecated: replaced by SEO. Removed at launch.');
	}
	page.moveField('seo').afterField('slug');

	for (const [id, name] of [['title', 'Title'], ['description', 'Description'], ['list', 'List'], ['url', 'URL'], ['imageCard', 'Image Card'], ['experienceCard', 'Experience Card']]) {
		migration.editContentType(id, {
			name: `[Deprecated] ${name}`,
			description: 'Deprecated: replaced by typed fields on Home Section. Kept until launch for the current live site. Do not edit.',
		});
	}
};
