import { NextRequest, NextResponse } from 'next/server';
import { studentQueries, clearanceQueries } from '@/lib/db/queries';
import { hashPassword, generateVerificationToken, getTokenExpiry } from '@/lib/auth/password';
import { sendVerificationEmail } from '@/lib/auth/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fullName, matricNumber, email, password, department, level } = body;

        // Validate required fields
        if (!fullName || !matricNumber || !email || !password || !department || !level) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Check password strength
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingEmail = await studentQueries.findStudentByEmail(email);
        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Check if matric number already exists
        const existingMatric = await studentQueries.findStudentByMatricNumber(matricNumber);
        if (existingMatric) {
            return NextResponse.json(
                { error: 'Matric number already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const tokenExpiry = getTokenExpiry();

        // Create student
        const student = await studentQueries.createStudent({
            fullName,
            matricNumber,
            email,
            passwordHash,
            department,
            level,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: tokenExpiry,
        });

        if (!student) {
            return NextResponse.json(
                { error: 'Failed to create account' },
                { status: 500 }
            );
        }

        // Create initial clearance record (uncleared)
        await clearanceQueries.createClearance(student.id);

        // Send verification email
        const emailSent = await sendVerificationEmail(email, fullName, verificationToken);

        return NextResponse.json({
            success: true,
            message: emailSent
                ? 'Registration successful! Please check your email to verify your account.'
                : 'Registration successful! Email verification could not be sent. Please contact support.',
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
