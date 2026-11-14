import Script from 'next/script';
import type { ReactElement } from 'react';

interface JsonLdProps {
	id: string;
	data: object;
}

/** JSON for a script tag, with < escaped. */
export const serializeJsonLd = (data: object): string =>
	JSON.stringify(data).replace(/</g, '\\u003c');

/** Structured-data script tag. */
const JsonLd = ({ id, data }: JsonLdProps): ReactElement => (
	<Script
		id={id}
		type="application/ld+json"
		dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
	/>
);

export default JsonLd;
