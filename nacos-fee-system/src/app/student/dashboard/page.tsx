'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardData {
    student: {
        id: string;
        fullName: string;
        matricNumber: string;
        email: string;
        department: string;
        level: string;
    };
    clearanceStatus: 'cleared' | 'uncleared';
    summary: {
        totalPaid: number;
        totalOutstanding: number;
        paidFeesCount: number;
        unpaidFeesCount: number;
    };
    recentPayments: Array<{
        id: string;
        fee_title: string;
        amount: number;
        status: string;
        reference: string;
        paid_at: string;
    }>;
}

export default function StudentDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch('/api/student/dashboard');
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Welcome, {data.student.fullName.split(' ')[0]}! 👋</h2>
                    <p className="text-slate-500">Matric No: {data.student.matricNumber}</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="bg-white p-2.5 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors relative">
                        <span className="material-icons-round text-slate-500">notifications</span>
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 bg-white pr-4 pl-2 py-2 rounded-full shadow-sm border border-slate-200">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {data.student.fullName.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-700 hidden sm:block">{data.student.fullName}</span>
                    </div>
                </div>
            </header>

            <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200 flex flex-col md:flex-row">
                <div className="flex-1 p-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Clearance Status</span>
                    <div className="flex items-center gap-4">
                        <div className={`px-5 py-2 rounded-full font-bold text-lg flex items-center gap-2 ${data.clearanceStatus === 'cleared'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                            }`}>
                            <span className="material-icons-round">
                                {data.clearanceStatus === 'cleared' ? 'verified' : 'pending_actions'}
                            </span>
                            {data.clearanceStatus === 'cleared' ? 'CLEARED' : 'UNCLEARED'}
                        </div>
                    </div>
                    <p className="mt-4 text-slate-600 leading-relaxed max-w-lg">
                        {data.clearanceStatus === 'cleared'
                            ? 'Congratulations! You have been cleared for the academic session.'
                            : 'Your NACOS fee clearance for the 2025/2026 academic session is still pending. Please settle all outstanding payments to generate your clearance certificate.'}
                    </p>
                    {data.clearanceStatus === 'uncleared' && (
                        <Link href="/student/fees" className="inline-flex mt-6 bg-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-green-700 transition-all transform hover:-translate-y-0.5">
                            Settle Fees Now
                        </Link>
                    )}
                </div>
                {/* <div className="w-full md:w-72 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-primary animate-spin mb-4"></div>
                    <p className="font-semibold text-slate-700">Checking Records</p>
                    <p className="text-xs text-slate-500 mt-1">Refreshed just now</p>
                </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-transform hover:scale-[1.02]">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                        <span className="material-icons-round text-red-500">credit_card_off</span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Outstanding Fees</p>
                    <h3 className="text-3xl font-bold mt-1 text-slate-900">₦{data.summary.totalOutstanding.toLocaleString()}</h3>
                    {data.summary.unpaidFeesCount > 0 && (
                        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                            <span className="material-icons-round text-[14px]">warning</span>
                            {data.summary.unpaidFeesCount} Pending Fees
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-transform hover:scale-[1.02]">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                        <span className="material-icons-round text-primary">account_balance_wallet</span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Total Paid</p>
                    <h3 className="text-3xl font-bold mt-1 text-slate-900">₦{data.summary.totalPaid.toLocaleString()}</h3>
                    {data.summary.paidFeesCount > 0 && (
                        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-green-50 px-2.5 py-1 rounded-lg">
                            <span className="material-icons-round text-[14px]">check_circle</span>
                            {data.summary.paidFeesCount} Transactions
                        </div>
                    )}
                </div>

                <div className="bg-primary p-6 rounded-2xl shadow-lg shadow-primary/20 flex flex-col justify-between text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div>
                        <p className="opacity-80 font-medium text-sm">Academic Session</p>
                        <h3 className="text-2xl font-bold mt-1">2025/2026</h3>
                    </div>
                    <div className="mt-8 border-t border-white/20 pt-4 flex justify-between items-center">
                        <span className="text-sm font-medium">{data.student.department}</span>
                        <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Recent Payments</h3>
                    <Link href="/student/fee" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                        View History <span className="material-icons-round text-sm">arrow_forward</span>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    {data.recentPayments.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-icons-round text-3xl text-slate-400">receipt_long</span>
                            </div>
                            <p>No payment history found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-sm text-slate-600 whitespace-nowrap">Description</th>
                                        <th className="px-6 py-4 font-bold text-sm text-slate-600 whitespace-nowrap">Date</th>
                                        <th className="px-6 py-4 font-bold text-sm text-slate-600 whitespace-nowrap">Amount</th>
                                        <th className="px-6 py-4 font-bold text-sm text-slate-600 whitespace-nowrap">Reference</th>
                                        <th className="px-6 py-4 font-bold text-sm text-slate-600 whitespace-nowrap">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.recentPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-800">{payment.fee_title}</td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">{new Date(payment.paid_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">₦{Number(payment.amount).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{payment.reference}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full inline-flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    SUCCESS
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
