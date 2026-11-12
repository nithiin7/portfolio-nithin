/**
 * Contract: removes the fields deprecated by 004–009 (the user approved
 * removing deprecated content on 2026-11-13, before launch). Home Section
 * names become "Home — <key>" now that nothing looks sections up by name.
 */
const { regexp, control } = require('../lib/schema.cjs');

const DEPRECATED_FIELDS = {
	portfolioDetails: ['keywords'],
	careerExperience: ['year', 'duration', 'technologies', 'order'],
	certification: ['issuedDate', 'expiryDate', 'logo'],
	testimonialCard: ['institution'],
	blogPost: ['category', 'authorName', 'authorAvatar', 'seoTitle', 'seoDescription', 'seoKeywords'],
	page: ['title', 'description', 'ogtitle', 'ogurl'],
	section: ['contents'],
};

module.exports = function (migration) {
	for (const [type, fields] of Object.entries(DEPRECATED_FIELDS)) {
		const contentType = migration.editContentType(type);
		for (const field of fields) contentType.deleteField(field);
	}

	const section = migration.editContentType('section');
	section.editField('name').validations([{ unique: true }, regexp('^Home — .{2,40}$', 'Format: "Home — <key>".')]);
	control(section, 'name', 'singleLine', 'Never shown. Format "Home — <key>", e.g. "Home — Work".');
	section.editField('key').required(true);
};
