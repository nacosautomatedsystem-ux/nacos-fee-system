import { NextRequest, NextResponse } from 'next/server';
import { studentQueries, adminQueries } from '@/lib/db/queries';
import { verifyPassword } from '@/lib/auth/password';
import { setSessionCookie } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { identifier, password, isAdmin } = body;

        // Validate required fields
        if (!identifier || !password) {
            return NextResponse.json(
                { error: 'Email/Matric number and password are required' },
                { status: 400 }
            );
        }

        if (isAdmin) {
            // Admin login
            const admin = await adminQueries.findAdminByEmail(identifier);

            if (!admin) {
                return NextResponse.json(
                    { error: 'Invalid credentials' },
                    { status: 401 }
                );
            }

            const isValidPassword = await verifyPassword(password, admin.password_hash);
            if (!isValidPassword) {
                return NextResponse.json(
                    { error: 'Invalid credentials' },
                    { status: 401 }
                );
            }

            // Set session cookie
            await setSessionCookie({
                userId: admin.id,
                email: admin.email,
                role: 'admin',
            });

            return NextResponse.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: admin.id,
                    fullName: admin.full_name,
                    email: admin.email,
                    role: 'admin',
                },
                redirectTo: '/admin/dashboard',
            });
        } else {
            // Student login (can use email or matric number)
            const student = await studentQueries.findStudentByEmailOrMatric(identifier);

            if (!student) {
                return NextResponse.json(
                    { error: 'Invalid credentials' },
                    { status: 401 }
                );
            }

            const isValidPassword = await verifyPassword(password, student.password_hash);
            if (!isValidPassword) {
                return NextResponse.json(
                    { error: 'Invalid credentials' },
                    { status: 401 }
                );
            }

            // Check email verification
            if (!student.email_verified) {
                return NextResponse.json(
                    { error: 'Please verify your email before logging in' },
                    { status: 403 }
                );
            }

            // Set session cookie
            await setSessionCookie({
                userId: student.id,
                email: student.email,
                role: 'student',
                emailVerified: student.email_verified,
            });

            return NextResponse.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: student.id,
                    fullName: student.full_name,
                    email: student.email,
                    matricNumber: student.matric_number,
                    role: 'student',
                },
                redirectTo: '/student/dashboard',
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        );
    }
}
