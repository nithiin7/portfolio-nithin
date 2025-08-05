export interface NewsletterSubscription {
	id: string;
	email: string;
	isActive: boolean;
	subscribedAt: string;
	updatedAt: string;
}

export interface NewsletterSubscriptionFormData {
	email: string;
}
