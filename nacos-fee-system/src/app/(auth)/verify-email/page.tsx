'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const verify = async () => {
            try {
                const response = await fetch(`/api/auth/verify-email?token=${token}`);
                if (response.ok) {
                    setStatus('success');
                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        router.push('/login?verified=true');
                    }, 2000);
                } else {
                    setStatus('error');
                    // If 400/404, it might be expired
                    const data = await response.json();
                    if (data.error === 'Invalid or expired token') {
                        router.push('/login?error=token_expired');
                    }
                }
            } catch {
                setStatus('error');
            }
        };

        verify();
    }, [token, router]);

    if (status === 'verifying') {
        return (
            <div className="text-center p-8">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-900">Verifying your email...</h2>
                <p className="text-gray-500 mt-2">Please wait while we activate your account.</p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons-round text-3xl">check</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Email Verified!</h2>
                <p className="text-gray-500 mt-2">Redirecting to login page...</p>
            </div>
        );
    }

    return (
        <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-round text-3xl">error_outline</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-gray-500 mt-2 mb-6">The link is invalid or has expired.</p>
            <button
                onClick={() => router.push('/login')}
                className="btn btn-primary w-full"
            >
                Back to Login
            </button>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
