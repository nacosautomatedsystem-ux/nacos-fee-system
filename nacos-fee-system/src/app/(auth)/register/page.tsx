'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        matricNumber: '',
        email: '',
        password: '',
        department: 'Computer Science', // Default
        level: '100 Level', // Default
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const departments = [
        'Computer Science',
        'Software Engineering',
        'Information Technology',
        'Cyber Security',
        'Mathematics',
        'Physics',
    ];

    const levels = ['100 Level', '200 Level', '300 Level', '400 Level', 'ND1', 'ND2', 'HND1', 'HND2'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    matricNumber: formData.matricNumber,
                    email: formData.email,
                    password: formData.password,
                    department: formData.department,
                    level: formData.level,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            setSuccess(true);
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons-round text-5xl">mark_email_read</span>
                </div>
                <h2 className="text-2xl font-bold mb-3">Check Your Email</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    We've sent a verification link to <strong>{formData.email}</strong>. Please click the link to activate your account.
                </p>
                <div className="space-y-4">
                    <Link href="/login" className="block w-full bg-primary hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20">
                        Proceed to Login
                    </Link>
                    <button className="text-sm font-medium text-slate-400 hover:text-slate-600">
                        Didn't receive email? Try again.
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Student Registration</h2>
                <p className="text-slate-500">Join the automated clearance system</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                    <span className="material-icons-round text-lg">error</span>
                    {error}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-1.5 ml-1">Full Name</label>
                        <input
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl transition-all outline-none"
                            placeholder="John Doe"
                            required
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 ml-1">Matric Number</label>
                        <input
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl transition-all outline-none"
                            placeholder="CSC/23/..."
                            required
                            type="text"
                            value={formData.matricNumber}
                            onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value.toUpperCase() })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 ml-1">Email Address</label>
                        <input
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl transition-all outline-none"
                            placeholder="student@sacoetec.edu.ng"
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 ml-1">Department</label>
                        <select
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl transition-all outline-none appearance-none"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 ml-1">Level</label>
                        <select
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl transition-all outline-none appearance-none"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        >
                            {levels.map(lvl => (
                                <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-1.5 ml-1">Create Password</label>
                        <input
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl transition-all outline-none"
                            placeholder="••••••••"
                            required
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all mt-4 active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Creating Account...
                        </>
                    ) : 'Create Account'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                    Already registered?
                    <Link href="/login" className="text-primary font-bold hover:underline ml-1">Log In</Link>
                </p>
            </div>
        </div>
    );
}
