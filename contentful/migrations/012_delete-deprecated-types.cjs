/** Deletes the content types emptied by 011 (frees 8 of the plan's 25). */
module.exports = function (migration) {
	for (const id of ['portfolioCard', 'title', 'description', 'list', 'url', 'imageCard', 'experienceCard', 'blogTag']) {
		migration.deleteContentType(id);
	}
};
