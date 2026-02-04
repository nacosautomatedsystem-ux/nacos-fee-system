'use client';

import { useEffect, useState } from 'react';

interface ReportData {
    financial: {
        totalRevenue: number;
        monthlyRevenue: number;
        dailyRevenue: number;
        averageTransaction: number;
    };
    students: {
        total: number;
        cleared: number;
        uncleared: number;
        clearanceRate: number;
    };
    payments: {
        total: number;
        successful: number;
        pending: number;
        failed: number;
    };
    departments: {
        name: string;
        students: number;
        cleared: number;
        revenue: number;
    }[];
}

export default function AdminReportsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ReportData | null>(null);
    const [dateRange, setDateRange] = useState('all');
    const [selectedReport, setSelectedReport] = useState('overview');

    useEffect(() => {
        fetchReportData();
    }, [dateRange]);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            // Fetch data from multiple endpoints
            const [studentsRes, paymentsRes] = await Promise.all([
                fetch('/api/admin/students'),
                fetch('/api/admin/payments')
            ]);

            const studentsData = await studentsRes.json();
            const paymentsData = await paymentsRes.json();

            // Calculate metrics
            const students = studentsData.students || [];
            const payments = paymentsData.payments || [];

            const clearedStudents = students.filter((s: any) => s.clearance_status === 'cleared');
            const successfulPayments = payments.filter((p: any) => p.status === 'success');

            const totalRevenue = successfulPayments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

            // Calculate monthly revenue (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const monthlyPayments = successfulPayments.filter((p: any) =>
                new Date(p.created_at) >= thirtyDaysAgo
            );
            const monthlyRevenue = monthlyPayments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

            // Calculate daily revenue (today)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dailyPayments = successfulPayments.filter((p: any) =>
                new Date(p.created_at) >= today
            );
            const dailyRevenue = dailyPayments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

            // Department breakdown
            const deptMap = new Map();
            students.forEach((student: any) => {
                const dept = student.department || 'Computer Science';
                if (!deptMap.has(dept)) {
                    deptMap.set(dept, { name: dept, students: 0, cleared: 0, revenue: 0 });
                }
                const deptData = deptMap.get(dept);
                deptData.students++;
                if (student.clearance_status === 'cleared') {
                    deptData.cleared++;
                }
            });

            // Calculate revenue per department
            successfulPayments.forEach((payment: any) => {
                const student = students.find((s: any) => s.id === payment.student_id);
                if (student) {
                    const dept = student.department || 'Computer Science';
                    if (deptMap.has(dept)) {
                        deptMap.get(dept).revenue += Number(payment.amount);
                    }
                }
            });

            setData({
                financial: {
                    totalRevenue,
                    monthlyRevenue,
                    dailyRevenue,
                    averageTransaction: successfulPayments.length > 0 ? totalRevenue / successfulPayments.length : 0
                },
                students: {
                    total: students.length,
                    cleared: clearedStudents.length,
                    uncleared: students.length - clearedStudents.length,
                    clearanceRate: students.length > 0 ? (clearedStudents.length / students.length) * 100 : 0
                },
                payments: {
                    total: payments.length,
                    successful: successfulPayments.length,
                    pending: payments.filter((p: any) => p.status === 'pending').length,
                    failed: payments.filter((p: any) => p.status === 'failed').length
                },
                departments: Array.from(deptMap.values())
            });
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = (reportType: string) => {
        if (!data) return;

        let csvContent = '';
        let filename = '';

        switch (reportType) {
            case 'financial':
                csvContent = 'Metric,Value\n';
                csvContent += `Total Revenue,₦${data.financial.totalRevenue.toLocaleString()}\n`;
                csvContent += `Monthly Revenue,₦${data.financial.monthlyRevenue.toLocaleString()}\n`;
                csvContent += `Daily Revenue,₦${data.financial.dailyRevenue.toLocaleString()}\n`;
                csvContent += `Average Transaction,₦${data.financial.averageTransaction.toLocaleString()}\n`;
                filename = 'financial_report.csv';
                break;
            case 'departments':
                csvContent = 'Department,Total Students,Cleared,Clearance Rate,Revenue\n';
                data.departments.forEach(dept => {
                    const rate = dept.students > 0 ? ((dept.cleared / dept.students) * 100).toFixed(1) : '0';
                    csvContent += `${dept.name},${dept.students},${dept.cleared},${rate}%,₦${dept.revenue.toLocaleString()}\n`;
                });
                filename = 'department_report.csv';
                break;
            case 'students':
                csvContent = 'Metric,Value\n';
                csvContent += `Total Students,${data.students.total}\n`;
                csvContent += `Cleared,${data.students.cleared}\n`;
                csvContent += `Uncleared,${data.students.uncleared}\n`;
                csvContent += `Clearance Rate,${data.students.clearanceRate.toFixed(1)}%\n`;
                filename = 'student_report.csv';
                break;
        }

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 font-display text-slate-900">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex min-w-72 flex-col gap-1">
                    <p className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900">Reports & Analytics</p>
                    <p className="text-primary/70 text-base font-normal leading-normal">Comprehensive insights and data exports for the 2025/2026 academic session.</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                    >
                        <option value="all">All Time</option>
                        <option value="month">Last 30 Days</option>
                        <option value="week">Last 7 Days</option>
                        <option value="today">Today</option>
                    </select>
                    <button
                        onClick={() => fetchReportData()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-icons-round text-base">refresh</span>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary to-green-700 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-icons-round text-white/80">account_balance_wallet</span>
                        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Total</span>
                    </div>
                    <p className="text-3xl font-black mb-1">₦{data?.financial.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-white/80 font-medium">Total Revenue</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-icons-round text-blue-500">groups</span>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{data?.students.clearanceRate.toFixed(1)}%</span>
                    </div>
                    <p className="text-3xl font-black mb-1 text-slate-900">{data?.students.cleared}</p>
                    <p className="text-sm text-slate-500 font-medium">Cleared Students</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-icons-round text-green-500">check_circle</span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Success</span>
                    </div>
                    <p className="text-3xl font-black mb-1 text-slate-900">{data?.payments.successful}</p>
                    <p className="text-sm text-slate-500 font-medium">Successful Payments</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="material-icons-round text-purple-500">trending_up</span>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Avg</span>
                    </div>
                    <p className="text-3xl font-black mb-1 text-slate-900">₦{data?.financial.averageTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <p className="text-sm text-slate-500 font-medium">Avg Transaction</p>
                </div>
            </div>

            {/* Report Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/50">
                    <div className="flex gap-1 p-2">
                        {['overview', 'financial', 'students', 'departments'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedReport(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedReport === tab
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {selectedReport === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Revenue Breakdown</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Daily</span>
                                            <span className="text-sm font-bold text-slate-900">₦{data?.financial.dailyRevenue.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Monthly</span>
                                            <span className="text-sm font-bold text-slate-900">₦{data?.financial.monthlyRevenue.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Total</span>
                                            <span className="text-sm font-bold text-primary">₦{data?.financial.totalRevenue.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Student Statistics</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Total</span>
                                            <span className="text-sm font-bold text-slate-900">{data?.students.total}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Cleared</span>
                                            <span className="text-sm font-bold text-green-600">{data?.students.cleared}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Uncleared</span>
                                            <span className="text-sm font-bold text-orange-600">{data?.students.uncleared}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Payment Status</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Successful</span>
                                            <span className="text-sm font-bold text-green-600">{data?.payments.successful}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Pending</span>
                                            <span className="text-sm font-bold text-yellow-600">{data?.payments.pending}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Failed</span>
                                            <span className="text-sm font-bold text-red-600">{data?.payments.failed}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedReport === 'financial' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Financial Summary</h3>
                                <button
                                    onClick={() => exportToCSV('financial')}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                                >
                                    <span className="material-icons-round text-base">download</span>
                                    Export CSV
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
                                    <p className="text-2xl font-black text-primary">₦{data?.financial.totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Monthly Revenue</p>
                                    <p className="text-2xl font-black text-slate-900">₦{data?.financial.monthlyRevenue.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Daily Revenue</p>
                                    <p className="text-2xl font-black text-slate-900">₦{data?.financial.dailyRevenue.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Average Transaction</p>
                                    <p className="text-2xl font-black text-slate-900">₦{data?.financial.averageTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedReport === 'students' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Student Analytics</h3>
                                <button
                                    onClick={() => exportToCSV('students')}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                                >
                                    <span className="material-icons-round text-base">download</span>
                                    Export CSV
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                        <p className="text-sm text-slate-500">Total Students</p>
                                        <p className="text-2xl font-black text-slate-900">{data?.students.total}</p>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="material-icons-round text-blue-600 text-3xl">groups</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-700 mb-1">Cleared</p>
                                        <p className="text-2xl font-black text-green-600">{data?.students.cleared}</p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <p className="text-sm text-orange-700 mb-1">Uncleared</p>
                                        <p className="text-2xl font-black text-orange-600">{data?.students.uncleared}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                    <p className="text-sm text-primary/70 mb-1">Clearance Rate</p>
                                    <div className="flex items-end gap-2">
                                        <p className="text-3xl font-black text-primary">{data?.students.clearanceRate.toFixed(1)}%</p>
                                        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-500"
                                                style={{ width: `${data?.students.clearanceRate}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedReport === 'departments' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Department Breakdown</h3>
                                <button
                                    onClick={() => exportToCSV('departments')}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                                >
                                    <span className="material-icons-round text-base">download</span>
                                    Export CSV
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-slate-900 text-sm font-bold uppercase tracking-wider">Department</th>
                                            <th className="px-6 py-4 text-slate-900 text-sm font-bold uppercase tracking-wider">Students</th>
                                            <th className="px-6 py-4 text-slate-900 text-sm font-bold uppercase tracking-wider">Cleared</th>
                                            <th className="px-6 py-4 text-slate-900 text-sm font-bold uppercase tracking-wider">Rate</th>
                                            <th className="px-6 py-4 text-slate-900 text-sm font-bold uppercase tracking-wider">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {data?.departments.map((dept, index) => (
                                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-slate-900">{dept.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-600">{dept.students}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-green-600">{dept.cleared}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary rounded-full"
                                                                style={{ width: `${dept.students > 0 ? (dept.cleared / dept.students) * 100 : 0}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-600">
                                                            {dept.students > 0 ? ((dept.cleared / dept.students) * 100).toFixed(1) : 0}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-primary">₦{dept.revenue.toLocaleString()}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Export All Section */}
            <div className="bg-gradient-to-r from-primary/10 to-green-100 rounded-xl p-6 border border-primary/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <span className="material-icons-round text-white text-2xl">file_download</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">Export Complete Report</h4>
                            <p className="text-sm text-slate-600">Download comprehensive analytics for all metrics</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            exportToCSV('financial');
                            exportToCSV('students');
                            exportToCSV('departments');
                        }}
                        className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md"
                    >
                        Download All Reports
                    </button>
                </div>
            </div>
        </div>
    );
}
