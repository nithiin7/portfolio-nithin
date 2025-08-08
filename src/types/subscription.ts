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

/**
 * Database newsletter subscription interface (snake_case columns)
 */
export interface DatabaseNewsletterSubscription {
	id: string;
	email: string;
	is_active: boolean;
	subscribed_at: string;
	updated_at: string;
}

/**
 * Database newsletter subscription creation interface (without id and timestamps)
 */
export interface DatabaseNewsletterSubscriptionCreate {
	email: string;
}

/**
 * Service error type
 */
export type ServiceError = Error | string | unknown | null;

/**
 * Service response type
 */
export interface ServiceResponse<T> {
	data: T | null;
	error: ServiceError;
}
