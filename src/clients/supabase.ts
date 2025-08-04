import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
	if (!supabaseInstance) {
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (!supabaseUrl || !supabaseAnonKey) {
			throw new Error('Missing Supabase environment variables');
		}

		supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
	}

	return supabaseInstance;
}
