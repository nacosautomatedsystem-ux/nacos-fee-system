import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define protected routes
const studentProtectedRoutes = ['/student'];
const adminProtectedRoutes = ['/admin/dashboard', '/admin/students', '/admin/payments', '/admin/fees'];
const studentAuthRoutes = ['/login', '/register'];
const adminAuthRoutes = ['/admin/login'];

interface SessionPayload {
    userId: string;
    email: string;
    role: 'student' | 'admin';
    emailVerified?: boolean;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'fallback-secret-change-in-production'
        );
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('session')?.value;

    // Parse the token
    const session = token ? await verifyToken(token) : null;

    // Handle admin login route
    if (adminAuthRoutes.some(route => pathname.startsWith(route))) {
        if (session && session.role === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Redirect authenticated users away from student auth pages
    if (studentAuthRoutes.some(route => pathname.startsWith(route))) {
        if (session) {
            if (session.role === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.redirect(new URL('/student/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Protect student routes
    if (studentProtectedRoutes.some(route => pathname.startsWith(route))) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (session.role !== 'student') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Protect admin routes (excluding login)
    if (adminProtectedRoutes.some(route => pathname.startsWith(route))) {
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        if (session.role !== 'admin') {
            return NextResponse.redirect(new URL('/student/dashboard', request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/student/:path*',
        '/admin/:path*',
        '/login',
        '/register',
    ],
};
