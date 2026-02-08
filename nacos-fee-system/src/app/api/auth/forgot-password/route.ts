import { NextResponse } from 'next/server';
import { findStudentByEmail, setResetToken } from '@/lib/db/queries/students';
import { sendPasswordResetEmail } from '@/lib/auth/email';
import crypto from 'crypto';

// POST /api/auth/forgot-password
export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const student = await findStudentByEmail(email);
        if (!student) {
            // For security, don't reveal if email exists or not
            return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to DB
        await setResetToken(email, resetToken, resetExpires);

        // Send email
        const emailSent = await sendPasswordResetEmail(email, resetToken);

        if (!emailSent) {
            console.error('Failed to send reset email');
            // We still return success to the user to avoid enumeration, but log the error
        }

        return NextResponse.json({
            message: 'If an account exists, a reset link has been sent.',
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
