import type {
	NewsletterSubscription,
	NewsletterSubscriptionFormData,
	DatabaseNewsletterSubscription,
	DatabaseNewsletterSubscriptionCreate,
	ServiceResponse,
	ServiceError,
} from 'types/subscription';

import { baseService } from '../index';

/**
 * Newsletter subscriptions service providing subscription-specific operations
 */
export class NewsletterSubscriptionsService {
	private readonly tableName = 'newsletter_subscriptions';

	/**
	 * Transform database subscription to NewsletterSubscription interface
	 */
	private transformSubscription(
		dbSubscription: DatabaseNewsletterSubscription
	): NewsletterSubscription {
		return {
			id: dbSubscription.id,
			email: dbSubscription.email,
			isActive: dbSubscription.is_active,
			subscribedAt: dbSubscription.subscribed_at,
			updatedAt: dbSubscription.updated_at,
		};
	}

	/**
	 * Transform NewsletterSubscriptionFormData to database format
	 */
	private transformToDatabase(
		subscriptionData: NewsletterSubscriptionFormData
	): DatabaseNewsletterSubscriptionCreate {
		return {
			email: subscriptionData.email,
		};
	}

	/**
	 * Subscribe a new email to the newsletter
	 */
	async subscribeEmail(
		subscriptionData: NewsletterSubscriptionFormData
	): Promise<ServiceResponse<NewsletterSubscription>> {
		try {
			const { data: existingSubscription, error: checkError } =
				await baseService.get<DatabaseNewsletterSubscription>(this.tableName, {
					email: subscriptionData.email,
				});

			if (checkError) {
				return { data: null, error: checkError };
			}

			if (existingSubscription && existingSubscription.length > 0) {
				const existing = existingSubscription[0];
				if (existing.is_active) {
					return { data: this.transformSubscription(existing), error: null };
				}

				const { data: reactivated, error: reactivateError } =
					await baseService.patch<DatabaseNewsletterSubscription>(
						this.tableName,
						existing.id,
						{ is_active: true }
					);

				if (reactivateError || !reactivated) {
					return { data: null, error: reactivateError };
				}

				return { data: this.transformSubscription(reactivated), error: null };
			}

			const dbData = this.transformToDatabase(subscriptionData);

			const { data, error } =
				await baseService.post<DatabaseNewsletterSubscription>(
					this.tableName,
					dbData
				);

			if (error || !data) {
				return { data: null, error };
			}

			const transformedSubscription = this.transformSubscription(data);
			return { data: transformedSubscription, error: null };
		} catch (error) {
			console.error(
				'Error in NewsletterSubscriptionsService.subscribeEmail:',
				error
			);
			return { data: null, error };
		}
	}

	/**
	 * Unsubscribe an email from the newsletter
	 */
	async unsubscribeEmail(
		email: string
	): Promise<ServiceResponse<NewsletterSubscription>> {
		try {
			const { data: existingSubscription, error: checkError } =
				await baseService.get<DatabaseNewsletterSubscription>(this.tableName, {
					email,
				});

			if (checkError) {
				return { data: null, error: checkError };
			}

			if (!existingSubscription || existingSubscription.length === 0) {
				return { data: null, error: 'Subscription not found' };
			}

			const subscription = existingSubscription[0];

			const { data: deactivated, error } =
				await baseService.patch<DatabaseNewsletterSubscription>(
					this.tableName,
					subscription.id,
					{ is_active: false }
				);

			if (error || !deactivated) {
				return { data: null, error };
			}

			const transformedSubscription = this.transformSubscription(deactivated);
			return { data: transformedSubscription, error: null };
		} catch (error) {
			console.error(
				'Error in NewsletterSubscriptionsService.unsubscribeEmail:',
				error
			);
			return { data: null, error };
		}
	}

	/**
	 * Get all active subscriptions
	 */
	async getActiveSubscriptions(): Promise<
		ServiceResponse<NewsletterSubscription[]>
	> {
		try {
			const { data, error } =
				await baseService.get<DatabaseNewsletterSubscription>(
					this.tableName,
					{ is_active: true },
					{
						orderBy: { column: 'subscribed_at', ascending: false },
					}
				);

			if (error) {
				return { data: null, error };
			}

			const transformedSubscriptions =
				data?.map((subscription) => this.transformSubscription(subscription)) ||
				[];
			return { data: transformedSubscriptions, error: null };
		} catch (error) {
			console.error(
				'Error in NewsletterSubscriptionsService.getActiveSubscriptions:',
				error
			);
			return { data: null, error };
		}
	}

	/**
	 * Get subscription by email
	 */
	async getSubscriptionByEmail(
		email: string
	): Promise<ServiceResponse<NewsletterSubscription>> {
		try {
			const { data, error } =
				await baseService.get<DatabaseNewsletterSubscription>(this.tableName, {
					email,
				});

			if (error) {
				return { data: null, error };
			}

			if (!data || data.length === 0) {
				return { data: null, error: null };
			}

			const transformedSubscription = this.transformSubscription(data[0]);
			return { data: transformedSubscription, error: null };
		} catch (error) {
			console.error(
				'Error in NewsletterSubscriptionsService.getSubscriptionByEmail:',
				error
			);
			return { data: null, error };
		}
	}

	/**
	 * Get subscription by ID
	 */
	async getSubscriptionById(
		id: string
	): Promise<ServiceResponse<NewsletterSubscription>> {
		try {
			const { data, error } =
				await baseService.getById<DatabaseNewsletterSubscription>(
					this.tableName,
					id
				);

			if (error || !data) {
				return { data: null, error };
			}

			const transformedSubscription = this.transformSubscription(data);
			return { data: transformedSubscription, error: null };
		} catch (error) {
			console.error(
				'Error in NewsletterSubscriptionsService.getSubscriptionById:',
				error
			);
			return { data: null, error };
		}
	}

	/**
	 * Delete a subscription
	 */
	async deleteSubscription(id: string): Promise<{ error: ServiceError }> {
		try {
			const { error } = await baseService.delete(this.tableName, id);
			return { error };
		} catch (error) {
			console.error(
				'Error in NewsletterSubscriptionsService.deleteSubscription:',
				error
			);
			return { error };
		}
	}
}

export const newsletterSubscriptionsService =
	new NewsletterSubscriptionsService();
