/** Records which numbered migrations have run in this environment. */
module.exports = function (migration) {
	const log = migration
		.createContentType('cmsMigration', {
			name: 'CMS Migration',
			description:
				'Written by `pnpm cms:migrate`. One entry per applied migration. Do not edit.',
		})
		.displayField('name');

	log.createField('id').name('Number').type('Symbol').required(true)
		.validations([{ unique: true }, { regexp: { pattern: '^\\d{3}$' } }]);
	log.createField('name').name('Migration').type('Symbol').required(true);
	log.createField('ranAt').name('Ran at').type('Date').required(true);
};
