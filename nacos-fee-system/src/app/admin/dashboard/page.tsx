'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardData {
    stats: {
        totalStudents: number;
        totalRevenue: number;
        successfulPayments: number;
        pendingPayments: number;
        clearedCount: number;
        unclearedCount: number;
    };
    recentPayments: Array<{
        id: string;
        reference: string;
        student_name: string;
        student_matric: string;
        fee_title: string;
        amount: number;
        status: string;
        created_at: string;
    }>;
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin/dashboard');
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-12">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>
        );
    }

    const clearedPercentage = data.stats.totalStudents > 0
        ? Math.round((data.stats.clearedCount / data.stats.totalStudents) * 100)
        : 0;

    return (
        <div className="p-8 space-y-8 font-display text-slate-900">
            {/* Header / Intro */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
                <p className="text-slate-500">Welcome back. Here is what's happening today at SACOETEC.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Students */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <span className="material-icons-round">groups</span>
                        </div>
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-100 px-2 py-1 rounded">+12%</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium mt-4">Total Students</h3>
                    <p className="text-2xl font-bold mt-1 text-slate-900">{data.stats.totalStudents.toLocaleString()}</p>
                </div>

                {/* Total Revenue */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <span className="material-icons-round">payments</span>
                        </div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">+8.2%</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium mt-4">Total Revenue</h3>
                    <p className="text-2xl font-bold mt-1 text-slate-900">₦{data.stats.totalRevenue.toLocaleString()}</p>
                </div>

                {/* Cleared Students */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <span className="material-icons-round">check_circle</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{clearedPercentage}%</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium mt-4">Cleared Students</h3>
                    <p className="text-2xl font-bold mt-1 text-slate-900">{data.stats.clearedCount.toLocaleString()}</p>
                </div>

                {/* Pending Clearance */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <span className="material-icons-round">hourglass_empty</span>
                        </div>
                        <span className="text-xs font-medium text-orange-500 bg-orange-100 px-2 py-1 rounded">{100 - clearedPercentage}%</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium mt-4">Pending Clearance</h3>
                    <p className="text-2xl font-bold mt-1 text-slate-900">{data.stats.unclearedCount.toLocaleString()}</p>
                </div>
            </div>

            {/* Charts & Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trends */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Revenue Trends</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Weekly performance</p>
                        </div>
                        <select className="text-sm bg-slate-50 border-slate-200 rounded-lg focus:ring-primary focus:border-primary p-2 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    {/* CSS Chart Bars */}
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                            const heights = ['40%', '65%', '55%', '90%', '70%', '30%', '20%']; // Mock Data
                            const isHigh = i === 3; // Mock
                            return (
                                <div key={day} className="flex flex-col items-center flex-1 group">
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-500 ease-in-out cursor-pointer group-hover:bg-primary ${isHigh ? 'bg-primary' : 'bg-primary/20'}`}
                                        style={{ height: heights[i] }}
                                    ></div>
                                    <span className={`text-[10px] mt-2 ${isHigh ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Clearance by Dept */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-6 text-slate-900">Clearance by Dept.</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Computer Science', val: 88, color: 'bg-primary' }

                        ].map(dept => (
                            <div key={dept.name}>
                                <div className="flex justify-between text-sm mb-2 text-slate-700">
                                    <span>{dept.name}</span>
                                    <span className="font-semibold">{dept.val}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className={`${dept.color} h-full transition-all duration-1000 rounded-full`} style={{ width: `${dept.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            <span className="font-bold">NOTE:</span> Computer Science department has the highest clearance rate this semester.
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Payments Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900">Recent Payment Clearances</h3>
                    <Link href="/admin/payments" className="text-sm text-primary font-semibold hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    {data.recentPayments.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                                <tr>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Matric No.</th>
                                    <th className="px-6 py-4">Dept.</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.recentPayments.map((payment, i) => {
                                    // Mock colors for avatar
                                    const colors = ['bg-blue-100 text-blue-600', 'bg-pink-100 text-pink-600', 'bg-emerald-100 text-emerald-600', 'bg-amber-100 text-amber-600'];
                                    const avatarColor = colors[i % colors.length];

                                    return (
                                        <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 flex items-center space-x-3">
                                                <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold`}>
                                                    {payment.student_name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{payment.student_name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{payment.student_matric}</td>
                                            <td className="px-6 py-4 text-sm text-slate-700">Computer Science</td> {/* Mock Dept */}
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">₦{Number(payment.amount).toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                {payment.status === 'success' ? (
                                                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">Cleared</span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 text-right">{new Date(payment.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-slate-500">No recent transactions found.</div>
                    )}
                </div>
            </div>

        </div>
    );
}
