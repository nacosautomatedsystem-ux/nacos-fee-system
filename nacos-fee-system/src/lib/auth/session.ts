import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const TOKEN_EXPIRY = '7d';

export interface SessionPayload {
    userId: string;
    email: string;
    role: 'student' | 'admin';
    emailVerified?: boolean;
}

/**
 * Create a JWT token for a user session
 */
export function createToken(payload: SessionPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): SessionPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as SessionPayload;
    } catch {
        return null;
    }
}

/**
 * Set session cookie
 */
export async function setSessionCookie(payload: SessionPayload): Promise<void> {
    const token = createToken(payload);
    const cookieStore = await cookies();

    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
        return null;
    }

    return verifyToken(token);
}

/**
 * Clear session cookie (logout)
 */
export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
    const session = await getSession();
    return session?.role === 'admin';
}

/**
 * Check if student email is verified
 */
export async function isEmailVerified(): Promise<boolean> {
    const session = await getSession();
    return session?.emailVerified === true;
}
