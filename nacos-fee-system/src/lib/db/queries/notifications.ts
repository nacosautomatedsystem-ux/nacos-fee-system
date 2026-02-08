import { supabase } from '../index';

export interface Notification {
    id: string;
    student_id: string;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success' | 'warning';
    is_read: boolean;
    created_at: string;
}

export async function getNotificationsByStudentId(studentId: string): Promise<Notification[]> {
    const { data, error } = await supabase.from('notifications')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
    const { error } = await supabase.from('notifications')
        .update({ is_read: true })
        .eq('id', id);

    if (error) throw error;
    return true;
}

export async function createNotification(data: {
    studentId: string;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success' | 'warning';
}): Promise<Notification> {
    const { data: notification, error } = await supabase.from('notifications')
        .insert({
            student_id: data.studentId,
            title: data.title,
            message: data.message,
            type: data.type,
        })
        .select()
        .single();

    if (error) throw error;
    return notification;
}

export async function getUnreadCount(studentId: string): Promise<number> {
    const { count, error } = await supabase.from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
        .eq('is_read', false);

    if (error) throw error;
    return count || 0;
}
