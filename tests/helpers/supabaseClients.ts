import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if(!supabaseUrl || !supabaseAnonKey || !supabaseService) {
    throw new Error("Missing environment variables");
}

export const serviceClient: SupabaseClient = createClient(supabaseUrl, supabaseService, { auth: { autoRefreshToken: false, persistSession: false } });
export const anonClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, { auth: { autoRefreshToken: false, persistSession: false } });

export async function getAuthedClient(email: string, password: string): Promise<SupabaseClient> {
    const client = createClient(supabaseUrl, supabaseAnonKey)
    const { error } = await client.auth.signInWithPassword({ email, password })
    if(error) {
        throw error
    }
    return client;
}