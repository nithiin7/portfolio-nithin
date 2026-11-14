/**
 * Blog Post: a dark-theme featured image beside the existing (light) one, so
 * blog covers swap with the theme like project covers. Expand only: the field
 * is optional and posts without it keep showing featuredImage in both themes.
 */
const { control, imageLink } = require('../lib/schema.cjs');

module.exports = function (migration) {
	const post = migration.editContentType('blogPost');

	imageLink(post.editField('featuredImage').name('Featured image (light)'), {
		width: { min: 1200 },
	});
	control(
		post,
		'featuredImage',
		'assetLinkEditor',
		'Paper cover from `pnpm plates:blog`, 3840×2160 WebP under 400 KB (docs/redesign/IMAGES.md). Light theme, OG and RSS.'
	);

	imageLink(
		post.createField('featuredImageDark').name('Featured image (dark)'),
		{
			width: { min: 1200 },
		}
	);
	control(
		post,
		'featuredImageDark',
		'assetLinkEditor',
		'Ink cover of the same image, same size. Used in dark theme; empty = the light image in both themes.'
	);
	post.moveField('featuredImageDark').afterField('featuredImage');
};
