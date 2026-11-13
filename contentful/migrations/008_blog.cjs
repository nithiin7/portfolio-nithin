/** Blog Post: category and author become references, SEO moves to an SEO entry. */
const { RICH_TEXT, SLUG, size, regexp, control, internalName, imageLink, entryLink, symbols, deprecateField } = require('../lib/schema.cjs');

module.exports = function (migration) {
	const category = migration.editContentType('blogCategory', {
		description: 'A blog category: the filter on /blog and the label on each post.',
	});
	internalName(category, 'Category — AI Engineering');
	category.displayField('internalName');
	category.editField('name').validations([{ unique: true }, size(40)]);
	control(category, 'name', 'singleLine', 'Shown on posts and in the /blog filter. Sentence case.');
	category.editField('slug').validations([{ unique: true }, regexp(SLUG, 'Lowercase words joined by hyphens.'), size(40, 2)]);
	control(category, 'slug', 'slugEditor', 'Stable key for the filter.', { trackingFieldId: 'name' });
	category.editField('description').validations([size(200)]);
	control(category, 'description', 'multipleLine', 'Optional, one sentence. 200 characters max.');
	category.moveField('internalName').toTheTop();

	migration.editContentType('blogTag', {
		name: '[Deprecated] Blog Tag',
		description: 'Deprecated: post tags are free text on the post. Do not use.',
	});

	const post = migration.editContentType('blogPost', {
		description: 'An article at /blog/[slug].',
	});
	internalName(post, 'Post — What is MCP');
	post.displayField('internalName');

	post.editField('title').validations([size(90)]);
	control(post, 'title', 'singleLine', 'Headline, sentence case. 90 characters max. No emoji.');
	post.editField('slug').validations([{ unique: true }, regexp(SLUG, 'Lowercase words joined by hyphens.'), size(60, 3)]);
	control(post, 'slug', 'slugEditor', 'URL: /blog/<slug>. Under ~6 words. Don\'t change it once published (or add a redirect).', { trackingFieldId: 'title' });
	post.editField('excerpt').validations([size(200)]);
	control(post, 'excerpt', 'multipleLine', 'One or two sentences for the listing and RSS. 200 characters max. Plain text.');
	post.editField('content').name('Body').validations(RICH_TEXT);
	control(post, 'content', 'richTextEditor', 'H2 for sections (they build the table of contents). A paragraph that is all code-marked text renders as a code block.');

	entryLink(post.createField('blogCategory').name('Category').required(true), ['blogCategory']);
	control(post, 'blogCategory', 'entryLinkEditor', 'Pick one existing category.');
	symbols(post.editField('tags'), 8, 40);
	control(post, 'tags', 'tagEditor', 'Up to 8 topics, Title Case, official spellings.');
	entryLink(post.createField('author').name('Author').required(true), ['person']);
	control(post, 'author', 'entryLinkEditor', 'Usually "Person — Nithin Pradeep".');

	imageLink(post.editField('featuredImage'), { width: { min: 1200 } });
	control(post, 'featuredImage', 'assetLinkEditor', '2400×1260 WebP under 400 KB, subject centred (crops to 16:10 and 4:3).');
	control(post, 'publishedDate', 'datePicker', 'Publication day.', { format: 'dateonly' });
	control(post, 'updatedDate', 'datePicker', 'Last meaningful edit. Empty = same as published.', { format: 'dateonly' });
	post.editField('readTime').validations([{ range: { min: 1, max: 60 } }]);
	control(post, 'readTime', 'numberEditor', 'Minutes, rounded up.');

	entryLink(post.createField('seo').name('SEO'), ['seo']);
	control(post, 'seo', 'entryLinkEditor', 'Optional. Without it the title and excerpt are used.');

	const deprecated = [
		['category', 'Category (text)'],
		['authorName', 'Author name'],
		['authorAvatar', 'Author avatar'],
		['seoTitle', 'SEO title'],
		['seoDescription', 'SEO description'],
		['seoKeywords', 'SEO keywords'],
	];
	for (const [id, label] of deprecated) {
		deprecateField(post, id, label);
		control(post, id, id === 'authorAvatar' ? 'assetLinkEditor' : id === 'seoKeywords' ? 'tagEditor' : 'singleLine', 'Deprecated: replaced by Category / Author / SEO. Removed at launch.');
	}

	post.moveField('internalName').toTheTop();
	post.moveField('blogCategory').afterField('excerpt');
	post.moveField('author').afterField('blogCategory');
	post.moveField('seo').afterField('readTime');
	for (const [id] of deprecated) post.moveField(id).toTheBottom();
};
