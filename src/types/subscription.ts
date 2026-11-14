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

export interface DatabaseNewsletterSubscription {
	id: string;
	email: string;
	is_active: boolean;
	subscribed_at: string;
	updated_at: string;
}

export interface DatabaseNewsletterSubscriptionCreate {
	id: string;
	email: string;
}
