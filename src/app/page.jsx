import React from 'react';
import loadData from 'helpers/contentful';

import HomeHeader from 'components/pages/homepage/HomeHeader';
import HomeAbout from 'components/pages/homepage/HomeAbout';
import HomeServices from 'components/pages/homepage/HomeServices';
import HomePortfolio from 'components/pages/homepage/HomePortfolio';
import HomeCollaborations from '../components/pages/homepage/HomeCollaborations/HomeCollaborations';
import HomeTestimonial from 'components/pages/homepage/HomeTestimonial';

export default async function Home() {
	const props = await loadData();
	const path = props?.data.pageCollection.items[0];

	return (
		<>
			<HomeHeader data={path?.sectionCollection.items[0].contentsCollection} />
			<HomeServices
				data={path.sectionCollection.items[1].contentsCollection.items[0]}
				services={path.sectionCollection.items[1].contentsCollection.items}
			/>
			<HomeAbout data={path.sectionCollection.items[2].contentsCollection} />
			<HomePortfolio
				data={path.sectionCollection.items[3].contentsCollection.items[0]}
				portfolio={
					path.sectionCollection.items[3].contentsCollection.items[1]
						.contentsCollection.items
				}
			/>
			<HomeCollaborations
				data={path.sectionCollection.items[4].contentsCollection.items[0]}
			/>
			<HomeTestimonial
				data={path.sectionCollection.items[5].contentsCollection.items[0]}
				testimonial={
					path.sectionCollection.items[5].contentsCollection.items[1]
						.contentsCollection.items
				}
			/>
		</>
	);
}
