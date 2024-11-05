import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Contact | Nithin',
		description: "Let's connect and bring about interesting opportunities",
		openGraph: {
			title: 'Nithin Pradeep - Aspiring Developer',
			description: "Let's connect and bring about interesting opportunities",
		},
		keywords: [
			'Nithin',
			'Nithin Pradeep',
			'Nithin Pradeep Portfolio',
			'Nithin Portfolio',
			'Portfolio',
			'Software Engineer',
			'Contact Nithin',
		],
		twitter: {
			card: 'summary_large_image',
			title: 'Nithin Pradeep - Aspiring Developer',
			description: "Let's connect and bring about interesting opportunities",
		},
		robots: {
			index: true,
			follow: true,
		},
		authors: [{ name: 'Nithin', url: 'https://github.com/nithiin7' }],
	};
}

interface ContactLayoutProps {
	children: React.ReactNode;
}

export default function ContactLayout({
	children,
}: Readonly<ContactLayoutProps>): JSX.Element {
	return <>{children}</>;
}
