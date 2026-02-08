import { NextResponse } from 'next/server';
import { findStudentByResetToken, updateStudentPassword } from '@/lib/db/queries/students';
import bcrypt from 'bcryptjs';

// POST /api/auth/reset-password
export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        const student = await findStudentByResetToken(token);
        if (!student) {
            return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear token
        await updateStudentPassword(student.id, hashedPassword);

        return NextResponse.json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
