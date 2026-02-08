import { NextResponse } from 'next/server';
import { findStudentByEmail, setResetToken } from '@/lib/db/queries/students';
import { sendPasswordResetEmail } from '@/lib/auth/email';
import crypto from 'crypto';

// POST /api/auth/forgot-password
export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            console.log('API: Forgot Password - Email missing');
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        console.log(`API: Forgot Password - Finding student: ${email}`);
        const student = await findStudentByEmail(email);
        if (!student) {
            console.log('API: Forgot Password - Student not found');
            return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

        console.log('API: Forgot Password - Saving token to DB...');
        // Save token to DB
        await setResetToken(email, resetToken, resetExpires);
        console.log('API: Forgot Password - Token saved.');

        console.log('API: Forgot Password - Sending email...');

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
