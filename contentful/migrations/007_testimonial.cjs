/** Testimonial Card becomes Testimonial: role and organisation split out. */
const { size, control, imageLink, deprecateField, regexp } = require('../lib/schema.cjs');

module.exports = function (migration) {
	const quote = migration.editContentType('testimonialCard', {
		name: 'Testimonial',
		description: 'A quote in the Testimonials section.',
	});
	quote.editField('name').name('Internal name')
		.validations([{ unique: true }, regexp('^Testimonial — .{2,80}$', 'Format: "Testimonial — <Author>".')]);
	control(quote, 'name', 'singleLine', 'Never shown. Format "Testimonial — <Author>".');
	quote.editField('review').name('Quote').required(true).validations([size(400)]);
	control(quote, 'review', 'multipleLine', 'Their words, without surrounding quote marks (the design adds them). 400 characters max.');
	quote.editField('reviewer').name('Author name').required(true).validations([size(60)]);
	control(quote, 'reviewer', 'singleLine', 'Full name.');
	quote.createField('authorRole').name('Author role').type('Symbol').required(true).validations([size(60)]);
	control(quote, 'authorRole', 'singleLine', 'Their title when you worked together, e.g. "Assistant Professor".');
	quote.createField('organisation').name('Organisation').type('Symbol').required(true).validations([size(80)]);
	control(quote, 'organisation', 'singleLine', 'Where, e.g. "SCMS School of Engineering & Technology".');
	imageLink(quote.editField('avatar'), { width: { min: 400 }, height: { min: 400 } });
	control(quote, 'avatar', 'assetLinkEditor', 'Square photo, at least 400×400 (800×800 recommended).');

	deprecateField(quote, 'institution', 'Institution');
	control(quote, 'institution', 'singleLine', 'Deprecated: split into Author role and Organisation. Removed at launch.');

	quote.moveField('review').afterField('name');
	quote.moveField('reviewer').afterField('review');
	quote.moveField('authorRole').afterField('reviewer');
	quote.moveField('organisation').afterField('authorRole');
	quote.moveField('institution').toTheBottom();
};
