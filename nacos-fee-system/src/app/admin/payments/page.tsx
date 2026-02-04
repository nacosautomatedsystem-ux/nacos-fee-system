'use client';

import { useEffect, useState } from 'react';

interface Payment {
    id: string;
    reference: string;
    student_name: string;
    student_matric: string;
    student_email: string;
    fee_title: string;
    amount: number;
    status: 'pending' | 'success' | 'failed';
    paid_at: string | null;
    created_at: string;
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('/api/admin/payments');
                const data = await response.json();
                if (response.ok) {
                    setPayments(data.payments);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Calculate Real Stats
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const successPayments = payments.filter(p => p.status === 'success');

    // Total Revenue
    const totalRevenue = successPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    // Daily Collection
    const dailyCollection = successPayments
        .filter(p => {
            const d = new Date(p.created_at);
            return d.getDate() === today.getDate() &&
                d.getMonth() === currentMonth &&
                d.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + Number(p.amount), 0);

    // Monthly Collection
    const monthlyCollection = successPayments
        .filter(p => {
            const d = new Date(p.created_at);
            return d.getMonth() === currentMonth &&
                d.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + Number(p.amount), 0);

    // Clearance Rate - Requiring Student Count (Mocking Denominator or Fetching)
    // Since we don't have total students here, we'll hide or just show "Payment Success Rate"
    // text-slate-500: "vs Failed/Pending"
    const totalTransactions = payments.length;
    const successRate = totalTransactions > 0 ? (successPayments.length / totalTransactions) * 100 : 0;

    // Collection Trend (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
    });

    const trendData = last7Days.map(day => {
        const dailySum = successPayments
            .filter(p => {
                const pd = new Date(p.created_at);
                return pd.getDate() === day.getDate() &&
                    pd.getMonth() === day.getMonth() &&
                    pd.getFullYear() === day.getFullYear();
            })
            .reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            day: day.toLocaleDateString('en-US', { weekday: 'short' }),
            amount: dailySum
        };
    });

    const maxTrend = Math.max(...trendData.map(d => d.amount), 1); // Avoid div by 0

    return (
        <div className="p-6 space-y-6 font-display text-slate-900">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">Payments & Reports</h2>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary w-64 transition-all placeholder-slate-400 text-slate-700"
                            placeholder="Search transactions..."
                            type="text"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-sm font-medium">Daily Collection</span>
                        <span className="material-icons-round text-primary bg-primary/10 p-1.5 rounded-lg">today</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">₦{dailyCollection.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        Today's total
                    </p>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-sm font-medium">Monthly Collection</span>
                        <span className="material-icons-round text-blue-500 bg-blue-500/10 p-1.5 rounded-lg">calendar_today</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">₦{monthlyCollection.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        Current month total
                    </p>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-sm font-medium">Success Rate</span>
                        <span className="material-icons-round text-purple-500 bg-purple-500/10 p-1.5 rounded-lg">check_circle</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{successRate.toFixed(1)}%</p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${successRate}%` }}></div>
                    </div>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-sm font-medium">Total Revenue</span>
                        <span className="material-icons-round text-amber-500 bg-amber-500/10 p-1.5 rounded-lg">account_balance_wallet</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">₦{totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Total Collected</p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-600">
                        <span className="material-icons-round text-lg">filter_list</span>
                        Filters
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-600">
                        Date Range
                        <span className="material-icons-round text-lg">expand_more</span>
                    </button>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-sm">
                    <span className="material-icons-round text-lg">download</span>
                    Export CSV
                </button>
            </div>

            {/* Transaction Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Loading payments...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Matric Number</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-slate-500">No transactions found.</td>
                                    </tr>
                                ) : (
                                    payments.map((payment, i) => (
                                        <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{payment.reference}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                        {payment.student_name ? payment.student_name.substring(0, 2).toUpperCase() : 'NA'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{payment.student_name}</p>
                                                        <p className="text-[10px] text-slate-500">{payment.fee_title || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{payment.student_matric}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">₦{Number(payment.amount).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-slate-700">{new Date(payment.created_at).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-slate-500">{new Date(payment.created_at).toLocaleTimeString()}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${payment.status === 'success' ? 'bg-primary/10 text-primary' :
                                                        payment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${payment.status === 'success' ? 'bg-primary' :
                                                            payment.status === 'pending' ? 'bg-amber-600' :
                                                                'bg-red-600'
                                                        }`}></span>
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button className="text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-icons-round text-lg">visibility</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                {/* Pagination Footer */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing {payments.length > 0 ? 1 : 0} to {payments.length > 5 ? 5 : payments.length} of {payments.length || 0} entries</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled>
                            <span className="material-icons-round text-lg">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold shadow-sm">1</button>
                        <button className="w-8 h-8 rounded-lg text-sm text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200">2</button>
                        <button className="w-8 h-8 rounded-lg text-sm text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200">3</button>
                        <span className="text-slate-400">...</span>
                        <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                            <span className="material-icons-round text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Trends & Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {/* Collection Trend */}
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-slate-900">Collection Trend (Last 7 Days)</h3>
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                        {trendData.map((d, i) => {
                            const percentage = maxTrend > 0 ? (d.amount / maxTrend) * 100 : 0;
                            return (
                                <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group">
                                    <div
                                        className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg"
                                        style={{ height: `${percentage}%` }}
                                        title={`₦${d.amount.toLocaleString()}`}
                                    ></div>
                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">{d.day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-slate-900">Payment Methods</h3>
                    {payments.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-icons-round text-slate-400">credit_card</span>
                                    <span className="text-sm font-medium text-slate-700">Online Payment (Paystack)</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900">100%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Currently all payments are processed via Paystack.</p>
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 py-8">No payment data available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
