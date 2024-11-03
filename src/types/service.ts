export interface ServiceItem {
	__typename: string;
	contentsCollection: {
		items: {
			title: string;
			subTitle: string;
			list: string[];
		}[];
	};
}

export interface ServiceHeader {
	title: string;
	subTitle: string;
}
