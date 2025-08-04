/**
 * Social media sharing helper functions
 * Provides generic functions for sharing content on various social platforms
 */

export interface ShareData {
	url: string;
	title: string;
	description?: string;
	image?: string;
}

/**
 * Share content on Facebook
 * @param data - The content data to share
 */
export const shareOnFacebook = (data: ShareData): void => {
	const url = encodeURIComponent(data.url);
	const text = encodeURIComponent(data.title);
	window.open(
		`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
		'_blank'
	);
};

/**
 * Share content on Twitter/X
 * @param data - The content data to share
 */
export const shareOnTwitter = (data: ShareData): void => {
	const url = encodeURIComponent(data.url);
	const text = encodeURIComponent(data.title);
	window.open(
		`https://twitter.com/intent/tweet?url=${url}&text=${text}`,
		'_blank'
	);
};

/**
 * Share content on LinkedIn
 * @param data - The content data to share
 */
export const shareOnLinkedIn = (data: ShareData): void => {
	const url = encodeURIComponent(data.url);
	const title = encodeURIComponent(data.title);
	const summary = encodeURIComponent(data.description || '');
	window.open(
		`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`,
		'_blank'
	);
};

/**
 * Share content on WhatsApp
 * @param data - The content data to share
 */
export const shareOnWhatsApp = (data: ShareData): void => {
	const url = encodeURIComponent(data.url);
	const text = encodeURIComponent(
		data.description ? `${data.title} - ${data.description}` : data.title
	);
	window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
};

/**
 * Share content on Telegram
 * @param data - The content data to share
 */
export const shareOnTelegram = (data: ShareData): void => {
	const url = encodeURIComponent(data.url);
	const text = encodeURIComponent(data.title);
	window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
};

/**
 * Copy content URL to clipboard
 * @param data - The content data to copy
 * @returns Promise<boolean> - Whether the copy was successful
 */
export const copyToClipboard = async (data: ShareData): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(data.url);
		return true;
	} catch (error) {
		console.error('Failed to copy to clipboard:', error);
		return false;
	}
};

/**
 * Generic share function that can be used with any platform
 * @param platform - The social media platform
 * @param data - The content data to share
 */
export const shareContent = (platform: string, data: ShareData): void => {
	switch (platform.toLowerCase()) {
		case 'facebook':
			shareOnFacebook(data);
			break;
		case 'twitter':
		case 'x':
			shareOnTwitter(data);
			break;
		case 'linkedin':
			shareOnLinkedIn(data);
			break;
		case 'whatsapp':
			shareOnWhatsApp(data);
			break;
		case 'telegram':
			shareOnTelegram(data);
			break;
		default:
			console.warn(`Unsupported platform: ${platform}`);
	}
};
