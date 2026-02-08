import { NextResponse } from 'next/server';
import { findStudentByEmail, setResetToken } from '@/lib/db/queries/students';
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

        // In a real app, send email here.
        // For development, we'll log the token or return it in development mode
        console.log(`[DEV] Password Reset Token for ${email}: ${resetToken}`);
        console.log(`[DEV] Reset Link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`);

        return NextResponse.json({
            message: 'If an account exists, a reset link has been sent.',
            // verified: true // un-comment for easy testing if needed, but risky for prod
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
