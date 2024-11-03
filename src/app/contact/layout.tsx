import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Contact | Nithin',
		description: "Let's connect and bring about interesting opportunities",
		openGraph: {
			title: 'Nithin Pradeep - Aspiring Developer',
			description: "Let's connect and bring about interesting opportunities",
		},
	};
}

interface ContactLayoutProps {
	children: React.ReactNode;
}

export default function ContactLayout({
	children,
}: ContactLayoutProps): JSX.Element {
	return <>{children}</>;
}
