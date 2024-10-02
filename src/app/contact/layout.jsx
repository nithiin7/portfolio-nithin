import loadData from 'helpers/contentful';
import PropTypes from 'prop-types';

import 'styles/globals.scss';

export async function generateMetadata() {
	const props = await loadData('home');
	const path = props?.data.pageCollection.items[0];

	return {
		title: 'Contact | Nithin',
		description: "Let's connect and bring about interesting opportunities",
		openGraph: {
			title: 'Nithin Pradeep - Aspiring Developer',
			description: path.description,
		},
	};
}

export default function ContactLayout({ children }) {
	return <>{children}</>;
}

ContactLayout.propTypes = {
	children: PropTypes.node,
};
