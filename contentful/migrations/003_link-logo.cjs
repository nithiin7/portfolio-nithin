/** Optional logo on Link, so a collaborator is a Link (name, website, logo). */
const { control } = require('../lib/schema.cjs');

module.exports = function (migration) {
	const link = migration.editContentType('link');
	link.createField('logo').name('Logo').type('Link').linkType('Asset')
		.validations([{ linkMimetypeGroup: ['image'] }]);
	control(link, 'logo', 'assetLinkEditor', 'Optional. Collaborator marks: a single-colour SVG with a viewBox, rendered as a mask in the theme colour. File name collab-<slug>--logo.svg.');
	link.moveField('logo').afterField('url');
};
