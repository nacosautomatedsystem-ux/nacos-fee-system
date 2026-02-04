'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');

    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: formData.identifier,
                    password: formData.password,
                    isAdmin: false,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || 'Login failed');
                return;
            }

            router.push(data.redirectTo || '/student/dashboard');
        } catch {
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 md:p-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400">Login to access your NACOS clearance portal</p>
            </div>

            {verified && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                    <span className="material-icons-round text-lg">check_circle</span>
                    Email verified successfully!
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <span className="material-icons-round text-lg">error</span>
                    {error === 'token_expired' ? 'Link expired. Please register again.' : 'Verification failed.'}
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <span className="material-icons-round text-lg">error</span>
                    {errorMessage}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-semibold mb-2 ml-1">Matric Number or Email</label>
                    <div className="relative">
                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-green-600">badge</span>
                        <input
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl transition-all outline-none"
                            placeholder="e.g. CSC/2023/001"
                            type="text"
                            required
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 ml-1">Password</label>
                    <div className="relative">
                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-green-600">lock</span>
                        <input
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl transition-all outline-none"
                            placeholder="••••••••"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    {/* <div className="text-right mt-2">
                        <a className="text-xs font-medium text-primary hover:underline" href="#">Forgot Password?</a>
                    </div> */}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Signing In...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?
                    <Link href="/register" className="text-primary font-bold hover:underline ml-1">Register Now</Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="p-12 flex justify-center">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
