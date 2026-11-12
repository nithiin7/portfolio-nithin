/** Tags plus the reusable building blocks: SEO, Link, Media, Person. */
const { HTTPS, URL_OR_PATH, size, regexp, control, internalName, imageLink } = require('../lib/schema.cjs');

module.exports = function (migration) {
	migration.createTag('deprecated', { name: 'Deprecated' });
	migration.createTag('retired', { name: 'Retired' });
	migration.createTag('needsReview', { name: 'Needs review' });
	migration.createTag('plate', { name: 'Plate' });

	const seo = migration.createContentType('seo', {
		name: 'SEO',
		description: 'Search and social metadata. Linked from pages, projects, posts and site settings.',
	}).displayField('internalName');
	internalName(seo, 'SEO — Project Orbit');
	seo.createField('title').name('Title').type('Symbol').required(true).validations([size(60)]);
	control(seo, 'title', 'singleLine', 'Browser tab and search result title. 60 characters max. The site adds " | Nithin Pradeep".');
	seo.createField('description').name('Description').type('Symbol').required(true).validations([size(160, 50)]);
	control(seo, 'description', 'multipleLine', 'Search result snippet and social card text. 50–160 characters.');
	imageLink(seo.createField('ogImage').name('Social image'), { width: { min: 1200, max: 1200 }, height: { min: 630, max: 630 } });
	control(seo, 'ogImage', 'assetLinkEditor', 'Optional. Exactly 1200×630. Without it, the site generates one.');
	seo.createField('noIndex').name('Hide from search engines').type('Boolean').defaultValue({ 'en-US': false });
	control(seo, 'noIndex', 'boolean', 'Yes adds noindex. Leave No for anything public.', { trueLabel: 'Yes', falseLabel: 'No' });

	const link = migration.createContentType('link', {
		name: 'Link',
		description: 'A labelled link: socials, contact channels and calls to action.',
	}).displayField('internalName');
	internalName(link, 'Link — GitHub');
	link.createField('label').name('Label').type('Symbol').required(true).validations([size(40)]);
	control(link, 'label', 'singleLine', 'Visible text. 40 characters max.');
	link.createField('url').name('URL').type('Symbol').required(true).validations([regexp(URL_OR_PATH, 'https://…, mailto:… or a site path starting with /.')]);
	control(link, 'url', 'urlEditor', 'https://…, mailto:… or a path on this site (/contact).');
	link.createField('detail').name('Detail').type('Symbol').validations([size(60)]);
	control(link, 'detail', 'singleLine', 'Optional second line, e.g. the email address under "Email". 60 characters max.');
	link.createField('icon').name('Icon').type('Symbol').validations([{ in: ['github', 'linkedin', 'instagram', 'x', 'bitbucket', 'credly', 'devto', 'email', 'whatsapp', 'messenger'] }]);
	control(link, 'icon', 'dropdown', 'Optional. Icon shown next to the label in socials lists.');
	link.createField('openInNewTab').name('Open in new tab').type('Boolean').defaultValue({ 'en-US': true });
	control(link, 'openInNewTab', 'boolean', 'Yes for external sites.', { trueLabel: 'Yes', falseLabel: 'No' });

	const media = migration.createContentType('media', {
		name: 'Media',
		description: 'An image with an optional video and caption, for rich-text embeds and future pages. Plain galleries use assets directly.',
	}).displayField('internalName');
	internalName(media, 'Media — Orbit agent workflow');
	imageLink(media.createField('image').name('Image').required(true));
	control(media, 'image', 'assetLinkEditor', 'Required. Alt text comes from the asset description.');
	media.createField('video').name('Video').type('Link').linkType('Asset').validations([{ linkMimetypeGroup: ['video'] }]);
	control(media, 'video', 'assetLinkEditor', 'Optional mp4/webm. The image becomes its poster.');
	media.createField('caption').name('Caption').type('Symbol').validations([size(200)]);
	control(media, 'caption', 'singleLine', 'Optional, shown under the image. 200 characters max.');
	media.createField('isDecorative').name('Decorative').type('Boolean').defaultValue({ 'en-US': false });
	control(media, 'isDecorative', 'boolean', 'Yes renders alt="" (the image adds nothing a screen reader needs).', { trueLabel: 'Yes', falseLabel: 'No' });

	const person = migration.createContentType('person', {
		name: 'Person',
		description: 'A named person, e.g. a blog post author.',
	}).displayField('internalName');
	internalName(person, 'Person — Nithin Pradeep');
	person.createField('name').name('Name').type('Symbol').required(true).validations([size(60)]);
	control(person, 'name', 'singleLine', 'Full name as shown on the site.');
	person.createField('role').name('Role').type('Symbol').validations([size(80)]);
	control(person, 'role', 'singleLine', 'Optional, e.g. "Senior Technical Consultant, EY".');
	imageLink(person.createField('avatar').name('Avatar'), { width: { min: 400 }, height: { min: 400 } });
	control(person, 'avatar', 'assetLinkEditor', 'Square, at least 400×400 (800×800 recommended).');
};
