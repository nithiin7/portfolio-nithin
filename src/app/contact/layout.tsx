import PropTypes from 'prop-types';

export async function generateMetadata() {
	return {
		title: 'Contact | Nithin',
		description: "Let's connect and bring about interesting opportunities",
		openGraph: {
			title: 'Nithin Pradeep - Aspiring Developer',
			description: "Let's connect and bring about interesting opportunities",
		},
	};
}

export default function ContactLayout({ children }) {
	return <>{children}</>;
}

ContactLayout.propTypes = {
	children: PropTypes.node,
};
