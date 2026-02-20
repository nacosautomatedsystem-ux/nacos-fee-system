import { supabase } from '../index';

export interface Student {
    id: string;
    full_name: string;
    matric_number: string;
    email: string;
    password_hash: string;
    department: string;
    level: string;
    email_verified: boolean;
    email_verification_token: string | null;
    email_verification_expires: string | null;
    created_at: string;
}

export async function findStudentById(id: string): Promise<Student | null> {
    const { data, error } = await supabase.from('students')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function findStudentByEmail(email: string): Promise<Student | null> {
    const { data, error } = await supabase.from('students')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function findStudentByMatricNumber(matricNumber: string): Promise<Student | null> {
    const { data, error } = await supabase.from('students')
        .select('*')
        .eq('matric_number', matricNumber.toUpperCase())
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function findStudentByEmailOrMatric(identifier: string): Promise<Student | null> {
    // Try email first
    let student = await findStudentByEmail(identifier);
    if (student) return student;

    // Try matric number
    student = await findStudentByMatricNumber(identifier);
    return student;
}

export async function createStudent(data: {
    fullName: string;
    matricNumber: string;
    email: string;
    passwordHash: string;
    department: string;
    level: string;
    emailVerificationToken: string;
    emailVerificationExpires: Date;
}): Promise<Student> {
    const { data: student, error } = await supabase.from('students')
        .insert({
            full_name: data.fullName,
            matric_number: data.matricNumber.toUpperCase(),
            email: data.email.toLowerCase(),
            password_hash: data.passwordHash,
            department: data.department,
            level: data.level,
            email_verified: false,
            email_verification_token: data.emailVerificationToken,
            email_verification_expires: data.emailVerificationExpires.toISOString(),
        })
        .select()
        .single();

    if (error) throw error;
    return student;
}

export async function findStudentByVerificationToken(token: string): Promise<Student | null> {
    const { data, error } = await supabase.from('students')
        .select('*')
        .eq('email_verification_token', token)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function verifyStudentEmail(studentId: string): Promise<Student | null> {
    const { data, error } = await supabase.from('students')
        .update({
            email_verified: true,
            email_verification_token: null,
            email_verification_expires: null,
        })
        .eq('id', studentId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getAllStudents(): Promise<Student[]> {
    const { data, error } = await supabase.from('students')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function searchStudents(search?: string, status?: string): Promise<(Student & { clearance_status: string })[]> {
    let query = supabase.from('students')
        .select(`
      *,
      clearance!left(status)
    `)
        .order('created_at', { ascending: false });

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,matric_number.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Transform the data to include clearance_status
    let students = (data || []).map((student: Student & { clearance?: any }) => {
        let status = 'uncleared';
        if (student.clearance) {
            status = Array.isArray(student.clearance)
                ? (student.clearance[0]?.status || 'uncleared')
                : (student.clearance.status || 'uncleared');
        }
        return {
            ...student,
            clearance_status: status,
        };
    });

    // Filter by status if provided
    if (status) {
        students = students.filter((s: Student & { clearance_status: string }) => s.clearance_status === status);
    }

    return students;
}

export async function countStudents(): Promise<number> {
    const { count, error } = await supabase.from('students')
        .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<Student | null> {
    const { data: updatedStudent, error } = await supabase.from('students')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return updatedStudent;
}
// Password Reset Functions
export async function setResetToken(email: string, token: string, expiresAt: Date): Promise<boolean> {
    const { error } = await supabase.from('students')
        .update({
            reset_password_token: token,
            reset_password_expires: expiresAt.toISOString(),
        })
        .eq('email', email.toLowerCase());

    if (error) throw error;
    return true;
}

export async function findStudentByResetToken(token: string): Promise<Student | null> {
    // Check if token matches AND hasn't expired
    const { data, error } = await supabase.from('students')
        .select('*')
        .eq('reset_password_token', token)
        .gt('reset_password_expires', new Date().toISOString())
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function updateStudentPassword(studentId: string, passwordHash: string): Promise<boolean> {
    const { error } = await supabase.from('students')
        .update({
            password_hash: passwordHash,
            reset_password_token: null,
            reset_password_expires: null,
        })
        .eq('id', studentId);

    if (error) throw error;
    return true;
}
