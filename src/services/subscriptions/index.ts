import { baseService } from 'services/index';
import type { ServiceResponse } from 'types/service';
import type {
	DatabaseNewsletterSubscription,
	DatabaseNewsletterSubscriptionCreate,
	NewsletterSubscription,
	NewsletterSubscriptionFormData,
} from 'types/subscription';

/** Newsletter subscriptions in Supabase. */
export class NewsletterSubscriptionsService {
	private readonly tableName = 'newsletter_subscriptions';

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

	private transformToDatabase(
		subscriptionData: NewsletterSubscriptionFormData
	): DatabaseNewsletterSubscriptionCreate {
		return {
			id: crypto.randomUUID(),
			email: subscriptionData.email,
		};
	}

	/** Subscribes an email, reactivating it if it had unsubscribed. */
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

			const existing = existingSubscription?.[0];
			if (existing) {
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
