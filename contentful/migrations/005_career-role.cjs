/** Career Experience becomes Career Role: real dates and a tech list. */
const { size, control, dateOnly, internalName, symbols, deprecateField } = require('../lib/schema.cjs');

module.exports = function (migration) {
	const role = migration.editContentType('careerExperience', {
		name: 'Career Role',
		description: 'A job in the Career section and on /resume. Sorted by start date, newest first.',
	});
	internalName(role, 'Role — EY, Senior Technical Consultant');
	role.displayField('internalName');

	role.editField('title').validations([size(60)]);
	control(role, 'title', 'singleLine', 'Job title as on the offer letter, e.g. "Senior Technical Consultant".');
	role.editField('company').validations([size(40)]);
	control(role, 'company', 'singleLine', 'Employer, e.g. "EY".');
	role.editField('location').validations([size(60)]);
	control(role, 'location', 'singleLine', '"City, Country", e.g. "Bangalore, India".');
	role.editField('type').name('Employment type').validations([{ in: ['full-time', 'contract', 'freelance', 'internship'] }]);
	control(role, 'type', 'dropdown', 'Shown as Full-time / Contract / Freelance / Internship.');

	role.createField('startDate').name('Start date').type('Date').required(true);
	dateOnly(role, 'startDate', 'First month in the role (any day of that month). Shown as "Aug 2026".');
	role.createField('endDate').name('End date').type('Date');
	dateOnly(role, 'endDate', 'Leave empty for your current role (shown as "Present").');

	role.editField('description').name('Summary').validations([size(320)]);
	control(role, 'description', 'multipleLine', 'Two sentences, starting with a verb, no "I". Past tense for finished roles. 320 characters max.');

	symbols(role.createField('techStack').name('Tech stack').required(true), 12, 40);
	control(role, 'techStack', 'tagEditor', 'Up to 12, most important first. Official spellings.');

	deprecateField(role, 'year', 'Year');
	deprecateField(role, 'duration', 'Duration');
	deprecateField(role, 'technologies', 'Technologies (text)');
	deprecateField(role, 'order', 'Order');
	for (const id of ['year', 'duration', 'technologies', 'order']) {
		control(role, id, id === 'order' ? 'numberEditor' : 'singleLine', 'Deprecated: derived from Start date / End date and Tech stack. Removed at launch.');
	}

	role.moveField('internalName').toTheTop();
	role.moveField('startDate').afterField('location');
	role.moveField('endDate').afterField('startDate');
	role.moveField('techStack').afterField('description');
	for (const id of ['year', 'duration', 'technologies', 'order']) role.moveField(id).toTheBottom();
};
