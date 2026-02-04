import { supabase } from '../index';

export interface Payment {
    id: string;
    student_id: string;
    fee_id: string;
    amount: number;
    reference: string;
    status: 'pending' | 'success' | 'failed';
    paid_at: string | null;
    created_at: string;
}

export interface PaymentWithDetails extends Payment {
    fee_title: string;
    student_name?: string;
    student_matric?: string;
    student_email?: string;
}

export async function getPaymentsByStudentId(studentId: string): Promise<PaymentWithDetails[]> {
    const { data, error } = await supabase.from('payments')
        .select(`
      *,
      fees(title)
    `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((p: Payment & { fees: { title: string } }) => ({
        ...p,
        fee_title: p.fees?.title || 'Unknown Fee',
    }));
}

export async function getPaymentByReference(reference: string): Promise<Payment | null> {
    const { data, error } = await supabase.from('payments')
        .select('*')
        .eq('reference', reference)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function createPayment(data: {
    studentId: string;
    feeId: string;
    amount: number;
    reference: string;
}): Promise<Payment> {
    const { data: payment, error } = await supabase.from('payments')
        .insert({
            student_id: data.studentId,
            fee_id: data.feeId,
            amount: data.amount,
            reference: data.reference,
            status: 'pending',
        })
        .select()
        .single();

    if (error) throw error;
    return payment;
}

export async function updatePaymentStatus(
    reference: string,
    status: 'success' | 'failed'
): Promise<Payment | null> {
    const updateData: Record<string, unknown> = { status };
    if (status === 'success') {
        updateData.paid_at = new Date().toISOString();
    }

    const { data, error } = await supabase.from('payments')
        .update(updateData)
        .eq('reference', reference)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function getAllPayments(): Promise<PaymentWithDetails[]> {
    const { data, error } = await supabase.from('payments')
        .select(`
      *,
      fees(title),
      students(full_name, matric_number, email)
    `)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((p: Payment & { fees: { title: string }; students: { full_name: string; matric_number: string; email: string } }) => ({
        ...p,
        fee_title: p.fees?.title || 'Unknown Fee',
        student_name: p.students?.full_name,
        student_matric: p.students?.matric_number,
        student_email: p.students?.email,
    }));
}

export async function getRecentPayments(limit: number = 10): Promise<PaymentWithDetails[]> {
    const { data, error } = await supabase.from('payments')
        .select(`
      *,
      fees(title),
      students(full_name, matric_number, email)
    `)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;

    return (data || []).map((p: Payment & { fees: { title: string }; students: { full_name: string; matric_number: string; email: string } }) => ({
        ...p,
        fee_title: p.fees?.title || 'Unknown Fee',
        student_name: p.students?.full_name,
        student_matric: p.students?.matric_number,
        student_email: p.students?.email,
    }));
}

export async function getTotalRevenue(): Promise<number> {
    const { data, error } = await supabase.from('payments')
        .select('amount')
        .eq('status', 'success');

    if (error) throw error;

    return (data || []).reduce((sum: number, p: { amount: number }) => sum + Number(p.amount), 0);
}

export async function getPaymentStats(): Promise<{
    successCount: number;
    pendingCount: number;
    failedCount: number;
}> {
    const { data, error } = await supabase.from('payments')
        .select('status');

    if (error) throw error;

    const payments = data || [];
    return {
        successCount: payments.filter((p: { status: string }) => p.status === 'success').length,
        pendingCount: payments.filter((p: { status: string }) => p.status === 'pending').length,
        failedCount: payments.filter((p: { status: string }) => p.status === 'failed').length,
    };
}

export async function hasStudentPaidFee(studentId: string, feeId: string): Promise<boolean> {
    const { data, error } = await supabase.from('payments')
        .select('id')
        .eq('student_id', studentId)
        .eq('fee_id', feeId)
        .eq('status', 'success')
        .limit(1);

    if (error) throw error;
    return (data?.length || 0) > 0;
}

export async function getSuccessfulPaymentsByStudent(studentId: string): Promise<PaymentWithDetails[]> {
    const { data, error } = await supabase.from('payments')
        .select(`
      *,
      fees(title)
    `)
        .eq('student_id', studentId)
        .eq('status', 'success')
        .order('paid_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((p: Payment & { fees: { title: string } }) => ({
        ...p,
        fee_title: p.fees?.title || 'Unknown Fee',
    }));
}
