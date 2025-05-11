import loadData from 'helpers/contentful';
import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

export async function generateMetadata(): Promise<Metadata> {
	const props = await loadData('contact');
	const path = props?.data.pageCollection.items[0];

	return {
		title: path.title,
		description: path.description,
		openGraph: {
			title: path.title,
			description: path.description,
		},
		keywords: path.keywords,
		twitter: {
			card: 'summary_large_image',
			title: path.ogtitle,
			description: path.description,
		},
		robots: {
			index: true,
			follow: true,
		},
		authors: [{ name: 'Nithin', url: 'https://github.com/nithiin7' }],
	};
}

interface ContactLayoutProps {
	children: ReactNode;
}

export default function ContactLayout({ children }: Readonly<ContactLayoutProps>): ReactElement {
	return <>{children}</>;
}
