import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { clientEnv } from 'helpers/env';

let supabaseInstance: SupabaseClient | null = null;

/** Shared Supabase client using the anon key. */
export function getSupabaseClient(): SupabaseClient {
	if (!supabaseInstance) {
		supabaseInstance = createClient(
			clientEnv.NEXT_PUBLIC_SUPABASE_URL,
			clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
		);
	}

	return supabaseInstance;
}
