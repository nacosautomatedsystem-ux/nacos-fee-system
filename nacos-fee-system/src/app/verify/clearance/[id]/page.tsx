import React from 'react';
import { clearanceQueries } from '@/lib/db/queries';
import Link from 'next/link';

interface VerifyPageProps {
    params: Promise<{ id: string }>;
}

export default async function VerifyClearancePage({ params }: VerifyPageProps) {
    const { id } = await params;

    let clearance = null;
    let error = null;

    try {
        clearance = await clearanceQueries.getClearanceById(id);
    } catch (err) {
        console.error('Verification error:', err);
        error = 'An error occurred during verification.';
    }

    const isValid = clearance && clearance.status === 'cleared';

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-display">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img
                        src="/images/nacos-logo.png"
                        alt="NACOS Logo"
                        className="w-20 h-20 mx-auto mb-4 object-contain"
                    />
                    <h1 className="text-2xl font-black text-slate-900 leading-tight">Certificate Verification</h1>
                    <p className="text-slate-500 text-sm mt-1">NACOS SACOETEC Digital Registry</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
                    {isValid ? (
                        <>
                            <div className="bg-primary p-8 text-center text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10">
                                    <span className="material-icons-round text-6xl mb-4">verified</span>
                                    <h2 className="text-2xl font-black uppercase tracking-widest">Authentic</h2>
                                    <p className="text-white/80 text-sm mt-1 font-medium italic">This certificate is valid and verified</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Student Name</p>
                                        <p className="text-sm font-bold text-slate-900">{clearance!.student_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Matric Number</p>
                                        <p className="text-sm font-bold text-slate-900 font-mono">{clearance!.student_matric}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Department</p>
                                        <p className="text-sm font-semibold text-slate-600">{clearance!.student_department}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Session</p>
                                        <p className="text-sm font-semibold text-slate-600">2025/2026</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification ID</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-black rounded-full uppercase">Verified</span>
                                    </div>
                                    <p className="text-xs font-mono font-bold text-slate-500 truncate">{clearance!.id}</p>
                                    <p className="text-[10px] text-slate-400 mt-2 italic">Issued on: {new Date(clearance!.updated_at).toLocaleDateString()}</p>
                                </div>

                                <div className="pt-4 text-center">
                                    <p className="text-xs text-slate-400 italic">"Empowering the next generation of computing professionals through integrity and excellence."</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons-round text-4xl">warning</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Certificate</h2>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                The certificate record could not be found or has not been cleared by the department.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"
                            >
                                Back to Home
                            </Link>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 NACOS SACOETEC CHAPTER</p>
                </div>
            </div>
        </div>
    );
}
