/** Deletes Media: it never held an entry and nothing renders it (frees 1 of the plan's 25). */
module.exports = function (migration) {
	migration.deleteContentType('media');
};
