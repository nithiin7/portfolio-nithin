import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import NotFound from 'components/pages/notFound/NotFound/NotFound';

export const metadata: Metadata = {
	title: 'Page not found',
	description: "The page you're looking for isn't in the index.",
	robots: { index: false },
};

export default function NotFoundPage(): ReactElement {
	return <NotFound />;
}
