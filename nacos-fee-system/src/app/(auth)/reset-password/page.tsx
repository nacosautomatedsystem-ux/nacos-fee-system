'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing reset token.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('Your password has been reset successfully.');
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to reset password.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An unexpected error occurred.');
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <div className="rounded-md bg-red-50 p-4 mb-6">
                    <p className="text-sm text-red-700">Invalid or missing reset token.</p>
                </div>
                <Link href="/forgot-password" className="font-medium text-primary hover:text-green-700">
                    Request a new link
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <span className="material-icons-round text-3xl text-primary">key</span>
                    </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Set new password</h2>
                <p className="mt-2 text-sm text-slate-600">
                    Your new password must be different to previously used passwords.
                </p>
            </div>

            {status === 'success' ? (
                <div className="mt-8 rounded-lg bg-green-50 p-4 border border-green-100">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span className="material-icons-round text-green-400">check_circle</span>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">Password Reset Complete</h3>
                            <div className="mt-2 text-sm text-green-700">
                                <p>{message}</p>
                                <p className="mt-2">Redirecting to login...</p>
                            </div>
                            <div className="mt-4">
                                <Link href="/login" className="text-sm font-medium text-green-800 hover:text-green-700 underline">
                                    Login now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                New Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons-round text-slate-400 text-lg">lock</span>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-slate-300 pl-10 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-primary sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons-round text-slate-400 text-lg">lock_clock</span>
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-slate-300 pl-10 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-primary sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {status === 'error' && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="material-icons-round text-red-400">error</span>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {status === 'loading' ? 'Reseting password...' : 'Reset password'}
                    </button>
                </form>
            )}
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
