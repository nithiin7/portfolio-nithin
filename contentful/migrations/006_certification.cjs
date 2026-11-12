/** Certification: Date fields, logo as an asset, validations. */
const { HTTPS, SLUG, size, regexp, control, dateOnly, internalName, deprecateField } = require('../lib/schema.cjs');

module.exports = function (migration) {
	const cert = migration.editContentType('certification', {
		description: 'A certification in the Certifications section and on /resume. Listed in the order the Home Section links them.',
	});
	internalName(cert, 'Cert — Databricks, Generative AI Engineer');
	cert.displayField('internalName');

	cert.editField('name').validations([{ unique: true }, size(80)]);
	control(cert, 'name', 'singleLine', 'Official certificate name, e.g. "Databricks Certified Generative AI Engineer Associate".');
	cert.editField('id').name('Slug').validations([{ unique: true }, regexp(SLUG, 'Lowercase words joined by hyphens.'), size(80, 3)]);
	control(cert, 'id', 'slugEditor', 'Stable key, e.g. "databricks-generative-ai-engineer".', { trackingFieldId: 'name' });
	cert.editField('provider').validations([size(40)]);
	control(cert, 'provider', 'singleLine', 'Issuer as written on their site, e.g. "Databricks".');

	cert.createField('providerLogo').name('Provider logo').type('Link').linkType('Asset').required(true)
		.validations([{ linkMimetypeGroup: ['image'] }]);
	control(cert, 'providerLogo', 'assetLinkEditor', 'Single-colour SVG, rendered as a mask in the theme colour. Reuse the provider\'s existing logo asset. File name cert-<provider>--logo.svg.');

	cert.editField('certificateUrl').name('Credential URL').validations([regexp(HTTPS, 'https://…')]);
	control(cert, 'certificateUrl', 'urlEditor', 'Public verification page (Credly, Coursera, the issuer…).');
	cert.editField('credentialId').name('Credential ID').validations([regexp('^\\S+$', 'No spaces.'), size(80)]);
	control(cert, 'credentialId', 'singleLine', 'As printed on the certificate, without spaces or trailing slashes.');

	cert.createField('issuedOn').name('Issued on').type('Date').required(true);
	dateOnly(cert, 'issuedOn', 'Date on the certificate.');
	cert.createField('expiresOn').name('Expires on').type('Date');
	dateOnly(cert, 'expiresOn', 'Leave empty if it doesn\'t expire. Expired certifications can\'t be highlighted.');

	cert.editField('highlight').name('Highlight');
	control(cert, 'highlight', 'boolean', 'Yes shows it as a featured badge. Only for current certifications.', { trueLabel: 'Yes', falseLabel: 'No' });

	deprecateField(cert, 'issuedDate', 'Issued date (text)');
	deprecateField(cert, 'expiryDate', 'Expiry date (text)');
	deprecateField(cert, 'logo', 'Logo path');
	for (const id of ['issuedDate', 'expiryDate', 'logo']) {
		control(cert, id, 'singleLine', 'Deprecated: replaced by Issued on / Expires on / Provider logo. Removed at launch.');
	}

	cert.moveField('internalName').toTheTop();
	cert.moveField('providerLogo').afterField('provider');
	cert.moveField('issuedOn').afterField('credentialId');
	cert.moveField('expiresOn').afterField('issuedOn');
	cert.moveField('highlight').afterField('expiresOn');
	for (const id of ['issuedDate', 'expiryDate', 'logo']) cert.moveField(id).toTheBottom();
};
