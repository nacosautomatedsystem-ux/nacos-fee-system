import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase client singleton
let supabaseClient: SupabaseClient | null = null;

// Get Supabase client (lazy initialization to avoid build-time errors)
function getSupabase(): SupabaseClient {
    if (supabaseClient) {
        return supabaseClient;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase URL and Service Role Key are required. Check your .env file.');
    }

    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    return supabaseClient;
}

// Export a getter for the supabase client
export const supabase = {
    get client() {
        return getSupabase();
    },
    from(table: string) {
        return getSupabase().from(table);
    },
    rpc(functionName: string, args?: Record<string, unknown>) {
        return getSupabase().rpc(functionName, args);
    }
};

// Create a public client for client-side operations (if needed)
export function createPublicClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(supabaseUrl, anonKey);
}

// Helper function for single row queries
export async function queryOne<T>(
    table: string,
    query: { column: string; value: unknown }
): Promise<T | null> {
    const { data, error } = await supabase.from(table)
        .select('*')
        .eq(query.column, query.value)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // No rows found
        }
        console.error('Database query error:', error);
        throw error;
    }

    return data as T;
}

// Helper function for multiple row queries
export async function queryMany<T>(
    table: string,
    options?: {
        filters?: Array<{ column: string; operator: string; value: unknown }>;
        orderBy?: { column: string; ascending?: boolean };
        limit?: number;
    }
): Promise<T[]> {
    let query = supabase.from(table).select('*');

    if (options?.filters) {
        for (const filter of options.filters) {
            if (filter.operator === 'eq') {
                query = query.eq(filter.column, filter.value);
            } else if (filter.operator === 'ilike') {
                query = query.ilike(filter.column, filter.value as string);
            } else if (filter.operator === 'in') {
                query = query.in(filter.column, filter.value as unknown[]);
            }
        }
    }

    if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? false,
        });
    }

    if (options?.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Database query error:', error);
        throw error;
    }

    return (data as T[]) || [];
}

// Helper function to insert a row
export async function insertOne<T>(
    table: string,
    data: Record<string, unknown>
): Promise<T> {
    const { data: result, error } = await supabase.from(table)
        .insert(data)
        .select()
        .single();

    if (error) {
        console.error('Database insert error:', error);
        throw error;
    }

    return result as T;
}

// Helper function to update rows
export async function updateOne<T>(
    table: string,
    match: { column: string; value: unknown },
    data: Record<string, unknown>
): Promise<T | null> {
    const { data: result, error } = await supabase.from(table)
        .update(data)
        .eq(match.column, match.value)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error('Database update error:', error);
        throw error;
    }

    return result as T;
}

// Helper function to delete rows
export async function deleteOne(
    table: string,
    match: { column: string; value: unknown }
): Promise<boolean> {
    const { error } = await supabase.from(table)
        .delete()
        .eq(match.column, match.value);

    if (error) {
        console.error('Database delete error:', error);
        throw error;
    }

    return true;
}

// Raw query function using Supabase's rpc (for complex queries)
export async function rawQuery<T>(
    functionName: string,
    args?: Record<string, unknown>
): Promise<T[]> {
    const { data, error } = await supabase.rpc(functionName, args);

    if (error) {
        console.error('Database RPC error:', error);
        throw error;
    }

    return data as T[];
}

export default supabase;
