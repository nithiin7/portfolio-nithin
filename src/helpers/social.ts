export interface ShareData {
	url: string;
	title: string;
}

export interface ShareLink {
	label: string;
	href: string;
}

/** Plain intent URLs, so share links render on the server and work without JS. */
export const shareLinks = ({ url, title }: ShareData): ShareLink[] => {
	const u = encodeURIComponent(url);
	const t = encodeURIComponent(title);
	return [
		{ label: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
		{
			label: 'LinkedIn',
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
		},
		{ label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}` },
		{ label: 'Email', href: `mailto:?subject=${t}&body=${u}` },
	];
};
