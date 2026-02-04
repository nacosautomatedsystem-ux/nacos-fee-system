import { supabase } from '../index';

export interface Admin {
    id: string;
    email: string;
    password_hash: string;
    full_name: string;
    created_at: string;
}

export async function findAdminById(id: string): Promise<Admin | null> {
    const { data, error } = await supabase.from('admins')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
    const { data, error } = await supabase.from('admins')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}
