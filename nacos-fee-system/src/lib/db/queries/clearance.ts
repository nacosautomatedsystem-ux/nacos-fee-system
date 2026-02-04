import { supabase } from '../index';

export interface Clearance {
    id: string;
    student_id: string;
    status: 'cleared' | 'uncleared';
    updated_at: string;
    created_at: string;
}

export async function getClearanceByStudentId(studentId: string): Promise<Clearance | null> {
    const { data, error } = await supabase.from('clearance')
        .select('*')
        .eq('student_id', studentId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function createClearance(studentId: string): Promise<Clearance> {
    const { data, error } = await supabase.from('clearance')
        .insert({
            student_id: studentId,
            status: 'uncleared',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateClearanceStatus(
    studentId: string,
    status: 'cleared' | 'uncleared'
): Promise<Clearance | null> {
    const { data, error } = await supabase.from('clearance')
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq('student_id', studentId)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function getOrCreateClearance(studentId: string): Promise<Clearance> {
    let clearance = await getClearanceByStudentId(studentId);
    if (!clearance) {
        clearance = await createClearance(studentId);
    }
    return clearance;
}

export async function setClearanceCleared(studentId: string): Promise<Clearance | null> {
    // First check if clearance exists
    const existing = await getClearanceByStudentId(studentId);

    if (!existing) {
        // Create one with cleared status
        const { data, error } = await supabase.from('clearance')
            .insert({
                student_id: studentId,
                status: 'cleared',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    return updateClearanceStatus(studentId, 'cleared');
}

export async function getAllClearances(): Promise<(Clearance & {
    student_name: string;
    student_matric: string;
})[]> {
    const { data, error } = await supabase.from('clearance')
        .select(`
      *,
      students(full_name, matric_number)
    `)
        .order('updated_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((c: Clearance & { students: { full_name: string; matric_number: string } }) => ({
        ...c,
        student_name: c.students?.full_name || 'Unknown',
        student_matric: c.students?.matric_number || 'Unknown',
    }));
}

export async function getClearanceStats(): Promise<{
    clearedCount: number;
    unclearedCount: number;
}> {
    const { data, error } = await supabase.from('clearance')
        .select('status');

    if (error) throw error;

    const clearances = data || [];
    return {
        clearedCount: clearances.filter((c: { status: string }) => c.status === 'cleared').length,
        unclearedCount: clearances.filter((c: { status: string }) => c.status === 'uncleared').length,
    };
}
