/**
 * Portfolio Details becomes the single Portfolio Project type. Portfolio Card
 * is deprecated: the homepage links projects directly and the card-only
 * "4 tech on the card" choice moves to techHighlights. Field IDs stay where
 * the type is already right (CONVENTIONS §4).
 */
const { HTTPS, RICH_TEXT, size, regexp, control, imageLink, entryLink, symbols, deprecateField, SLUG } = require('../lib/schema.cjs');

const COVER = { width: { min: 3840, max: 3840 }, height: { min: 2160, max: 2160 } };
const INTERNAL = '^Project — .{2,80}$';

module.exports = function (migration) {
	const project = migration.editContentType('portfolioDetails', {
		name: 'Portfolio Project',
		description: 'A project in Selected Works and its case study at /portfolio/[slug].',
	});

	project.editField('name').name('Internal name').required(true)
		.validations([{ unique: true }, regexp(INTERNAL, 'Format: "Project — <Name>".')]);
	control(project, 'name', 'singleLine', 'Never shown. Format "Project — <Name>", e.g. "Project — Orbit".');

	project.editField('title').required(true).validations([size(60)]);
	control(project, 'title', 'singleLine', 'Card and case-study title, e.g. "Orbit: Self-Hosted Personal Assistant". 60 characters max.');

	project.editField('slug').required(true)
		.validations([{ unique: true }, regexp(SLUG, 'Lowercase words joined by hyphens.'), size(60, 3)]);
	control(project, 'slug', 'slugEditor', 'URL: /portfolio/<slug>. The project name only, e.g. "orbit". Don\'t change it once published.', { trackingFieldId: 'title' });

	project.editField('id').name('Legacy ID');
	control(project, 'id', 'numberEditor', 'Old numeric URL (/portfolio/<id>) that redirects here. Never reuse a number. New projects: next unused number.');

	project.editField('shortDescription').name('Summary').required(true).validations([size(160)]);
	control(project, 'shortDescription', 'multipleLine', 'One sentence under the card title and as the case-study lede. 160 characters max.');

	project.editField('description').name('Body').required(true).validations(RICH_TEXT);
	control(project, 'description', 'richTextEditor', 'Case study. Use H2s "Problem", "Approach", "Architecture", "Outcome" to get the structured layout; the first image under Architecture becomes the diagram.');

	project.createField('role').name('Role').type('Symbol').validations([size(60)]);
	control(project, 'role', 'singleLine', 'Optional, e.g. "Solo — design, build, deploy". 60 characters max.');

	project.editField('year').required(true).validations([regexp('^20\\d{2}$', 'Four-digit year.')]);
	control(project, 'year', 'singleLine', 'Year shipped (or started, if ongoing).');

	project.editField('demo').name('Live demo URL').validations([regexp(HTTPS, 'https://…')]);
	control(project, 'demo', 'urlEditor', 'Only a running demo or hosted product. Leave empty rather than repeating the repository URL.');
	project.editField('github').name('Repository URL').validations([regexp(HTTPS, 'https://…')]);
	control(project, 'github', 'urlEditor', 'Public source code.');

	imageLink(project.editField('spotlightImage').name('Cover (light)').required(true), COVER);
	control(project, 'spotlightImage', 'assetLinkEditor', 'Paper plate, exactly 3840×2160 (docs/redesign/IMAGES.md). Card, case-study cover and next-project preview in light theme.');
	imageLink(project.editField('spotlightImageDark').name('Cover (dark)').required(true), COVER);
	control(project, 'spotlightImageDark', 'assetLinkEditor', 'Ink plate of the same cover, exactly 3840×2160. Used in dark theme.');

	project.editField('gallery')
		.items({ type: 'Link', linkType: 'Asset', validations: [{ linkMimetypeGroup: ['image'] }] })
		.validations([size(12)]);
	control(project, 'gallery', 'assetGalleryEditor', 'Up to 12 images in reading order; 1st, 4th, 7th… render wide. 3840×2160 plates. Alt text = asset description.');

	symbols(project.editField('tech').required(true), 20, 40);
	control(project, 'tech', 'tagEditor', 'Full stack for the case study, most important first. Official spellings (Next.js, FastAPI, OpenAI…).');
	symbols(project.createField('techHighlights').name('Card tech'), 4, 40);
	control(project, 'techHighlights', 'tagEditor', 'Up to 4 shown on the homepage card. Empty = the first 4 of Tech.');

	symbols(project.editField('features'), 8, 200);
	control(project, 'features', 'tagEditor', 'Up to 8, one sentence each (200 characters). Optional "Label: sentence" form; keep one style per project.');

	entryLink(project.createField('seo').name('SEO'), ['seo']);
	control(project, 'seo', 'entryLinkEditor', 'Optional. Without it the title and summary are used.');

	deprecateField(project, 'keywords', 'Keywords');
	control(project, 'keywords', 'tagEditor', 'Deprecated: not used by the site. Removed at launch.');

	project.moveField('name').toTheTop();
	project.moveField('title').afterField('name');
	project.moveField('slug').afterField('title');
	project.moveField('shortDescription').afterField('slug');
	project.moveField('year').afterField('shortDescription');
	project.moveField('role').afterField('year');
	project.moveField('spotlightImage').afterField('role');
	project.moveField('spotlightImageDark').afterField('spotlightImage');
	project.moveField('techHighlights').afterField('spotlightImageDark');
	project.moveField('tech').afterField('techHighlights');
	project.moveField('features').afterField('tech');
	project.moveField('description').afterField('features');
	project.moveField('gallery').afterField('description');
	project.moveField('github').afterField('gallery');
	project.moveField('demo').afterField('github');
	project.moveField('seo').afterField('demo');
	project.moveField('id').afterField('seo');
	project.moveField('keywords').toTheBottom();

	migration.editContentType('portfolioCard', {
		name: '[Deprecated] Portfolio Card',
		description: 'Deprecated: merged into Portfolio Project. Kept until launch for the current live site. Do not edit.',
	});
};
