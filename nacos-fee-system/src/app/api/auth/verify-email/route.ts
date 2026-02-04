import { NextRequest, NextResponse } from 'next/server';
import { studentQueries } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
        }

        // Find student by verification token
        const student = await studentQueries.findStudentByVerificationToken(token);

        if (!student) {
            return NextResponse.redirect(new URL('/login?error=token_expired', request.url));
        }

        // Check if token has expired
        if (student.email_verification_expires) {
            const expiresAt = new Date(student.email_verification_expires);
            if (expiresAt < new Date()) {
                return NextResponse.redirect(new URL('/login?error=token_expired', request.url));
            }
        }

        // Verify the email
        const verified = await studentQueries.verifyStudentEmail(student.id);

        if (!verified) {
            return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
        }

        // Redirect to login with success message
        return NextResponse.redirect(new URL('/login?verified=true', request.url));
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
    }
}
