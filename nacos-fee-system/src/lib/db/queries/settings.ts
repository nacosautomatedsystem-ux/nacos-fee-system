import { supabase } from '../index';

export type Setting = {
    key: string;
    value: any;
    description?: string;
    updated_at: string;
    updated_by?: string;
};

export async function getSettings(): Promise<Setting[]> {
    const { data, error } = await supabase
        .from('settings')
        .select('*');

    if (error) {
        console.error('Error fetching settings:', error);
        return [];
    }
    return data || [];
}

export async function getSettingByKey(key: string): Promise<Setting | null> {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', key)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }
    return data;
}

export async function updateSetting(key: string, value: any, updatedBy?: string): Promise<Setting | null> {
    const { data, error } = await supabase
        .from('settings')
        .upsert({
            key,
            value,
            updated_at: new Date().toISOString(),
            updated_by: updatedBy
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Helper to get grouped settings if stored individually
// Or if stored as a single object, just getByKey
