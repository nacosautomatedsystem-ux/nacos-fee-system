'use client';

import { useEffect, useState } from 'react';

interface Student {
    id: string;
    fullName: string;
    matricNumber: string;
    email: string;
    department: string;
    level: string;
    emailVerified: boolean;
    clearanceStatus: 'cleared' | 'uncleared';
    createdAt: string;
}

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchStudents();
    }, [search, statusFilter]);

    const fetchStudents = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/admin/students?${params}`);
            const data = await response.json();
            if (response.ok) {
                setStudents(data.students);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate mock stats based on loaded students (or use real data if endpoint provided it)
    const totalStudents = students.length;
    const clearedCount = students.filter(s => s.clearanceStatus === 'cleared').length;
    const unclearedCount = students.filter(s => s.clearanceStatus === 'uncleared').length;
    // Mock revenue calculation
    const totalRevenue = totalStudents * 2500;

    return (
        <div className="p-4 md:p-8 font-display text-slate-900">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Student Management</h2>
                    <p className="text-slate-500 text-sm">Manage and monitor NACOS fee clearance for all students.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-primary hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm shadow-primary/20">
                        <span className="material-icons-round text-lg">person_add</span>
                        <span>Add Student</span>
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Students</span>
                        <span className="material-icons-round text-blue-500 bg-blue-50 p-1.5 rounded-lg">groups</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{totalStudents.toLocaleString()}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-green-500 font-medium">
                        <span className="material-icons-round text-[12px]">trending_up</span>
                        <span>12% from last session</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Cleared</span>
                        <span className="material-icons-round text-green-500 bg-green-50 p-1.5 rounded-lg">check_circle</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{clearedCount.toLocaleString()}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <span>{totalStudents > 0 ? Math.round((clearedCount / totalStudents) * 100) : 0}% total progress</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Uncleared</span>
                        <span className="material-icons-round text-orange-500 bg-orange-50 p-1.5 rounded-lg">pending</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{unclearedCount.toLocaleString()}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-orange-500 font-medium">
                        <span>Awaiting payment/approval</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
                        <span className="material-icons-round text-primary bg-primary/10 p-1.5 rounded-lg">account_balance_wallet</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">₦{(totalRevenue / 1000000).toFixed(2)}M</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <span>Current Session Collection</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Filters Bar */}
                <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary transition-all placeholder-slate-400 text-slate-700"
                                placeholder="Search by name or matric number..."
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select className="bg-white border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-primary focus:border-primary text-slate-600 outline-none">
                                <option>All Departments</option>
                                <option>Computer Science</option>
                                <option>Information Tech</option>
                                <option>Software Engineering</option>
                            </select>
                            <select
                                className="bg-white border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-primary focus:border-primary text-slate-600 outline-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="cleared">Cleared</option>
                                <option value="uncleared">Uncleared</option>
                            </select>
                            <button className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                                <span className="material-icons-round">file_download</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500 italic">Loading students...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 bg-slate-50">
                                    <th className="px-6 py-4">
                                        <input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                    </th>
                                    <th className="px-6 py-4">Student Details</th>
                                    <th className="px-6 py-4">Matric Number</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Session</th>
                                    <th className="px-6 py-4">Clearance Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-500">
                                            No students found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden text-slate-500">
                                                        <span className="material-icons-round">person</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{student.fullName}</p>
                                                        <p className="text-[10px] text-slate-500">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-mono text-slate-600">{student.matricNumber}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs px-2 py-1 bg-slate-100 rounded font-medium text-slate-600">{student.department || 'Computer Science'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">2025/2026</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${student.clearanceStatus === 'cleared' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></span>
                                                    <span className={`text-xs font-semibold ${student.clearanceStatus === 'cleared' ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {student.clearanceStatus === 'cleared' ? 'Cleared' : 'Uncleared'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-icons-round text-lg">visibility</span></button>
                                                    <button className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"><span className="material-icons-round text-lg">edit</span></button>
                                                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><span className="material-icons-round text-lg">delete</span></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        Showing <span className="font-semibold text-slate-900">1</span> to <span className="font-semibold text-slate-900">{students.length > 10 ? 10 : students.length}</span> of <span className="font-semibold text-slate-900">{totalStudents}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-400 hover:text-primary transition-all flex items-center hover:bg-slate-50">
                            <span className="material-icons-round text-sm">chevron_left</span>
                        </button>
                        <button className="px-3 py-1.5 border border-primary rounded bg-primary text-white text-xs font-bold shadow-sm">1</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors">2</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors">3</button>
                        <span className="text-slate-400 text-xs">...</span>
                        <button className="px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors">125</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-600 hover:text-primary transition-all flex items-center hover:bg-slate-50">
                            <span className="material-icons-round text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
