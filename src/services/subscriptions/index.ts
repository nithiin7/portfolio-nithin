import { baseService } from 'services/index';
import type { ServiceResponse } from 'types/service';
import type {
	DatabaseNewsletterSubscription,
	DatabaseNewsletterSubscriptionCreate,
	NewsletterSubscription,
	NewsletterSubscriptionFormData,
} from 'types/subscription';

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
			id: crypto.randomUUID(),
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

			// No INSERT ... RETURNING: anon has no SELECT policy on this table
			// (supabase-security-fix.sql), so the row is built locally
			const { error } = await baseService.post(this.tableName, dbData, {
				select: false,
			});

			if (error) {
				return { data: null, error };
			}

			const now = new Date().toISOString();
			return {
				data: {
					id: dbData.id,
					email: dbData.email,
					isActive: true,
					subscribedAt: now,
					updatedAt: now,
				},
				error: null,
			};
		} catch (error) {
			console.error(
				'Error in NewsletterSubscriptionsService.subscribeEmail:',
				error
			);
			return { data: null, error };
		}
	}
}

export const newsletterSubscriptionsService =
	new NewsletterSubscriptionsService();
