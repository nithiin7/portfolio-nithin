import Button from 'components/utilities/Button/Button';
import React from 'react';

export default function Custom404(): JSX.Element {
	return (
		<div className="not-found">
			<h1>There&apos;s NOTHING here...</h1>
			<h3>
				...maybe the page you&apos;re looking for is not found or never existed
			</h3>
			<Button text="Back to Home" />
		</div>
	);
}
