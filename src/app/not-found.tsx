import Link from 'next/link';
import type { ReactElement } from 'react';

import Button from 'components/utilities/Button/Button';

export const metadata = {
	title: 'Page Not Found :(',
	description: "Oops! The page you're looking for does not exist.",
};

export default function Custom404(): ReactElement {
	return (
		<div className="not-found">
			<h1>There&apos;s NOTHING here...</h1>
			<h3>
				...maybe the page you&apos;re looking for is not found or never existed
			</h3>
			<Link href="/">
				<Button text="Back to Home" />
			</Link>
		</div>
	);
}
