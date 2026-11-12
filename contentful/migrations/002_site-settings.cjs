/**
 * Site identity singleton and the small types the homepage sections list.
 * Collaborators are Links with a logo (003): the space plan allows 25 content
 * types, and a dedicated type would have been the 26th.
 */
const { HTTPS, size, regexp, control, internalName, entryLink, entryLinks, symbols } = require('../lib/schema.cjs');

module.exports = function (migration) {
	const site = migration.createContentType('siteSettings', {
		name: 'Site Settings',
		description: 'Singleton: who the site is about. Read by the layout, hero, menu, footer, JSON-LD, social images and manifest. Exactly one entry.',
	}).displayField('internalName');
	internalName(site, 'Site — Nithin Pradeep');
	site.createField('name').name('Name').type('Symbol').required(true).validations([size(60)]);
	control(site, 'name', 'singleLine', 'Full name. The hero splits it into one line per word.');
	site.createField('role').name('Role').type('Symbol').required(true).validations([size(60)]);
	control(site, 'role', 'singleLine', 'Current job title, e.g. "Senior Technical Consultant".');
	site.createField('company').name('Company').type('Symbol').required(true).validations([size(40)]);
	control(site, 'company', 'singleLine', 'Current employer as shown after "@".');
	site.createField('city').name('City').type('Symbol').required(true).validations([size(40)]);
	control(site, 'city', 'singleLine', 'Shown in the hero, menu and preloader. "Bangalore".');
	site.createField('region').name('Region').type('Symbol').validations([size(40)]);
	control(site, 'region', 'singleLine', 'State, for structured data. "Karnataka".');
	site.createField('countryCode').name('Country code').type('Symbol').required(true).validations([regexp('^[A-Z]{2}$', 'Two-letter ISO code, e.g. IN.')]);
	control(site, 'countryCode', 'singleLine', 'ISO 3166 two-letter code, e.g. IN.');
	site.createField('timeZone').name('Time zone').type('Symbol').required(true).validations([regexp('^[A-Za-z_]+/[A-Za-z_]+$', 'IANA zone, e.g. Asia/Kolkata.')]);
	control(site, 'timeZone', 'singleLine', 'IANA time zone for the live clock, e.g. Asia/Kolkata.');
	site.createField('isAvailable').name('Open to work').type('Boolean').defaultValue({ 'en-US': true });
	control(site, 'isAvailable', 'boolean', 'Turns the hero status dot green.', { trueLabel: 'Yes', falseLabel: 'No' });
	site.createField('availabilityLabel').name('Availability label').type('Symbol').required(true).validations([size(40)]);
	control(site, 'availabilityLabel', 'singleLine', 'Hero status text, e.g. "Available for new projects".');
	site.createField('email').name('Email').type('Symbol').required(true).validations([regexp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', 'An email address.')]);
	control(site, 'email', 'singleLine', 'Public contact address (contact page, footer, JSON-LD).');
	entryLinks(site.createField('socials').name('Social profiles'), ['link'], 10);
	control(site, 'socials', 'entryLinksEditor', 'Profiles in display order. Each Link needs an icon. Also used as JSON-LD sameAs.');
	entryLinks(site.createField('contactChannels').name('Contact channels'), ['link'], 6);
	control(site, 'contactChannels', 'entryLinksEditor', 'Contact page options (Email, WhatsApp…). Put the visible address or number in each Link\'s Detail.');
	symbols(site.createField('knowsAbout').name('Knows about'), 15, 60);
	control(site, 'knowsAbout', 'tagEditor', 'Topics for structured data (schema.org knowsAbout). Not shown on the page.');
	entryLink(site.createField('seo').name('Default SEO').required(true), ['seo']);
	control(site, 'seo', 'entryLinkEditor', 'Title, description and social image for the home page and any page without its own.');
	site.createField('twitterHandle').name('X handle').type('Symbol').validations([regexp('^@[A-Za-z0-9_]{1,15}$', 'Starts with @.')]);
	control(site, 'twitterHandle', 'singleLine', 'For X cards, e.g. @_nithiin7.');

	const capability = migration.createContentType('capability', {
		name: 'Capability',
		description: 'One column of the "What I do" section.',
	}).displayField('internalName');
	internalName(capability, 'Capability — AI systems');
	capability.createField('title').name('Title').type('Symbol').required(true).validations([size(40)]);
	control(capability, 'title', 'singleLine', 'Column heading, sentence case. 40 characters max.');
	capability.createField('summary').name('Summary').type('Symbol').required(true).validations([size(200)]);
	control(capability, 'summary', 'multipleLine', 'One or two sentences on what you do here. 200 characters max.');
	symbols(capability.createField('items').name('Items'), 6, 60);
	control(capability, 'items', 'tagEditor', 'Up to 6 concrete offerings, 60 characters each.');

	const principle = migration.createContentType('principle', {
		name: 'Principle',
		description: 'One "How I work" point in the About section.',
	}).displayField('internalName');
	internalName(principle, 'Principle — Thin slice first');
	principle.createField('title').name('Title').type('Symbol').required(true).validations([size(40)]);
	control(principle, 'title', 'singleLine', 'Short imperative, e.g. "Thin slice first". 40 characters max.');
	principle.createField('body').name('Body').type('Symbol').required(true).validations([size(120)]);
	control(principle, 'body', 'multipleLine', 'One sentence. 120 characters max.');

	const stat = migration.createContentType('stat', {
		name: 'Stat',
		description: 'A hand-entered number in the About stats row. Years, projects and certifications are counted automatically; add only what the site cannot count.',
	}).displayField('internalName');
	internalName(stat, 'Stat — Concurrent users served');
	stat.createField('value').name('Value').type('Integer').required(true).validations([{ range: { min: 0 } }]);
	control(stat, 'value', 'numberEditor', 'The number, e.g. 1000000.');
	stat.createField('suffix').name('Suffix').type('Symbol').validations([size(3)]);
	control(stat, 'suffix', 'singleLine', 'Optional, e.g. "+".');
	stat.createField('label').name('Label').type('Symbol').required(true).validations([size(30)]);
	control(stat, 'label', 'singleLine', 'Under the number, sentence case. 30 characters max.');
	stat.createField('isCompact').name('Compact number').type('Boolean').defaultValue({ 'en-US': false });
	control(stat, 'isCompact', 'boolean', 'Yes shows 1000000 as "1M".', { trueLabel: 'Yes', falseLabel: 'No' });
};
