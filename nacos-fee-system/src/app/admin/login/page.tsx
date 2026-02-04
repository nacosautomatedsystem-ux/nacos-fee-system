'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: email, password, isAdmin: true }),
            });

            if (res.ok) {
                const data = await res.json();
                router.push(data.redirectTo || '/admin/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 dark:bg-[#122210] transition-colors duration-300">
            <div className="layout-container flex h-full grow flex-col">
                <div className="flex flex-1 justify-center items-center py-10 px-4">
                    <div className="flex flex-col max-w-[480px] w-full bg-white dark:bg-[#1a2e18] shadow-2xl rounded-xl overflow-hidden border border-primary/10">

                        {/* Header Section with Logo */}
                        <div className="p-6 flex flex-col items-center border-b border-slate-100 dark:border-primary/20">
                            <div className="w-20 h-20 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="material-icons-round text-primary text-5xl">account_balance</span>
                            </div>
                            <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center">Admin Access</h1>
                            <p className="text-primary dark:text-green-200 text-sm font-normal leading-normal text-center mt-1">SACOETEC NACOS Fee Clearance System</p>
                        </div>

                        {/* Form Section */}
                        <div className="p-6 md:p-8 space-y-6">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="flex flex-col w-full">
                                        <p className="text-slate-900 dark:text-gray-200 text-sm font-bold leading-normal pb-2">Admin Email Address</p>
                                        <div className="relative">
                                            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                                            <input
                                                className="w-full flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-slate-200 dark:border-primary/30 bg-white dark:bg-[#122210] h-12 placeholder:text-slate-400 pl-11 pr-4 text-sm font-medium transition-all"
                                                placeholder="admin@sacoetec.edu.ng"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </label>
                                </div>

                                {/* Password Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="flex flex-col w-full">
                                        <p className="text-slate-900 dark:text-gray-200 text-sm font-bold leading-normal pb-2">Password</p>
                                        <div className="relative">
                                            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                            <input
                                                className="w-full flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-slate-200 dark:border-primary/30 bg-white dark:bg-[#122210] h-12 placeholder:text-slate-400 pl-11 pr-4 text-sm font-medium transition-all"
                                                placeholder="••••••••"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </label>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between px-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-[#122210]"
                                            type="checkbox"
                                        />
                                        <span className="text-xs font-medium text-slate-500 dark:text-gray-300 group-hover:text-primary transition-colors">Remember me</span>
                                    </label>
                                    <a className="text-xs font-semibold text-primary hover:underline hover:text-green-700" href="#">Forgot password?</a>
                                </div>

                                {/* Action Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold tracking-wide w-full hover:bg-green-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Secure Login'
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Footer Links */}
                            <div className="pt-4 flex flex-col items-center gap-2 border-t border-slate-50 dark:border-white/5">
                                <p className="text-xs text-slate-500 dark:text-gray-400">Restricted access for authorized personnel only.</p>
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-100 dark:border-green-800">
                                    <span className="material-icons-round text-primary text-sm">verified_user</span>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary dark:text-green-400">Encrypted Connection</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Footer */}
                <footer className="py-6 px-4 text-center">
                    <p className="text-xs text-slate-400 dark:text-gray-500 font-medium">© {new Date().getFullYear()} SACOETEC Higher Institution, Nigeria. NACOS Department.</p>
                </footer>
            </div>
        </div>
    );
}
