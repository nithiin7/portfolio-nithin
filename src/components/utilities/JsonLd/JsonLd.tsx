import Script from 'next/script';
import type { ReactElement } from 'react';

interface JsonLdProps {
	id: string;
	data: object;
}

/** Serialises schema.org data; `<` is escaped so CMS text can't close the tag. */
export const serializeJsonLd = (data: object): string =>
	JSON.stringify(data).replace(/</g, '\\u003c');

const JsonLd = ({ id, data }: JsonLdProps): ReactElement => (
	<Script
		id={id}
		type="application/ld+json"
		dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
	/>
);

export default JsonLd;
