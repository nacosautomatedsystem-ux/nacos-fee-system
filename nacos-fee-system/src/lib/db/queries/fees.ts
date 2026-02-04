import { supabase } from '../index';

export interface Fee {
    id: string;
    title: string;
    amount: number;
    session: string;
    is_active: boolean;
    created_at: string;
}

export async function getAllFees(): Promise<Fee[]> {
    const { data, error } = await supabase.from('fees')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getActiveFees(): Promise<Fee[]> {
    const { data, error } = await supabase.from('fees')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getFeeById(id: string): Promise<Fee | null> {
    const { data, error } = await supabase.from('fees')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function createFee(data: {
    title: string;
    amount: number;
    session: string;
}): Promise<Fee> {
    const { data: fee, error } = await supabase.from('fees')
        .insert({
            title: data.title,
            amount: data.amount,
            session: data.session,
            is_active: true,
        })
        .select()
        .single();

    if (error) throw error;
    return fee;
}

export async function updateFee(
    id: string,
    data: Partial<{
        title: string;
        amount: number;
        session: string;
        is_active: boolean;
    }>
): Promise<Fee | null> {
    const { data: fee, error } = await supabase.from('fees')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return fee;
}

export async function deleteFee(id: string): Promise<boolean> {
    const { error } = await supabase.from('fees')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}
