/**
 * Home Section gains the `manifesto` key and a `words` list: the heading holds
 * the statement with a {word} token that the site scrubs through on scroll.
 */
const { size, control } = require('../lib/schema.cjs');

const KEYS = ['hero', 'manifesto', 'work', 'about', 'capabilities', 'career', 'certifications', 'collaborations', 'testimonials'];

module.exports = function (migration) {
	const section = migration.editContentType('section');

	section.editField('key').validations([{ unique: true }, { in: KEYS }]);

	section.createField('words').name('Words').type('Array')
		.items({ type: 'Symbol', validations: [size(32)] })
		.validations([size(8, 2)]);
	control(section, 'words', 'tagEditor', 'Manifesto only: the words the {word} token in Heading cycles through, in order. The last one stays. 2–8 words, 32 characters each.');
	section.moveField('words').afterField('lede');

	control(section, 'heading', 'singleLine', 'Section title, sentence case (the design sets its own casing). 60 characters max. Manifesto: the statement, with {word} where the Words go.');
};
