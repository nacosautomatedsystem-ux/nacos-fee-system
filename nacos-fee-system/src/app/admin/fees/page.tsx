'use client';

import { useEffect, useState } from 'react';

interface Fee {
    id: string;
    title: string;
    amount: number;
    session: string;
    is_active: boolean;
    category: string;
    description: string;
}

export default function AdminFeesPage() {
    const [fees, setFees] = useState<Fee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFee, setEditingFee] = useState<Fee | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        session: '',
        category: 'Departmental',
        description: ''
    });
    const [saving, setSaving] = useState(false);

    const fetchFees = async () => {
        try {
            const response = await fetch('/api/admin/fees');
            const data = await response.json();
            if (response.ok && data.fees) {
                setFees(data.fees);
            } else {
                setFees([]);
            }
        } catch (err) {
            console.error(err);
            setFees([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    const openModal = (fee?: Fee) => {
        if (fee) {
            setEditingFee(fee);
            setFormData({
                title: fee.title,
                amount: fee.amount.toString(),
                session: fee.session,
                category: fee.category || 'Departmental',
                description: fee.description || ''
            });
        } else {
            setEditingFee(null);
            setFormData({ title: '', amount: '', session: '2025/2026', category: 'Departmental', description: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingFee(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = '/api/admin/fees';
            const method = editingFee ? 'PUT' : 'POST';
            const body = editingFee ? { id: editingFee.id, ...formData } : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchFees();
                closeModal();
            } else {
                alert('Failed to save fee');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this fee?')) return;
        try {
            const response = await fetch(`/api/admin/fees?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchFees();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Real stats
    const totalFees = fees.length;
    const activeSession = "2025/2026";
    // Revenue is harder to calculate without payments, setting to 0 or removing mock
    const totalRevenue = 0;

    return (
        <div className="p-8 space-y-8 font-display text-slate-900">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex min-w-72 flex-col gap-1">
                    <p className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900">Fees Management</p>
                    <p className="text-primary/70 text-base font-normal leading-normal">Configure and manage institutional fee types for NACOS and various departments.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-md hover:bg-green-700 transition-all"
                >
                    <span className="material-icons-round">add</span>
                    <span>Add New Fee</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-sm font-medium">Total Fee Types</p>
                        <span className="material-icons-round text-primary/40">list_alt</span>
                    </div>
                    <p className="text-slate-900 tracking-light text-3xl font-bold leading-tight">{totalFees}</p>
                </div>
                <div className="flex flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-sm font-medium">Active Session</p>
                        <span className="material-icons-round text-primary/40">calendar_today</span>
                    </div>
                    <p className="text-slate-900 tracking-light text-3xl font-bold leading-tight">{activeSession}</p>
                </div>
                <div className="flex flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-sm font-medium">Total Revenue (Current)</p>
                        <span className="material-icons-round text-primary/40">account_balance_wallet</span>
                    </div>
                    <p className="text-primary tracking-light text-3xl font-bold leading-tight">₦{totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Fees Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-900">Configured Fees</h3>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            <span className="material-icons-round">filter_list</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            <span className="material-icons-round">download</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Loading fees...</div>
                    ) : fees.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">No fees configured. Click "Add New Fee" to get started.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-slate-900 text-sm font-bold uppercase tracking-wider">Fee Name</th>
                                    <th className="px-6 py-4 text-slate-900 text-sm font-bold uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-slate-900 text-sm font-bold uppercase tracking-wider">Session</th>
                                    <th className="px-6 py-4 text-slate-900 text-sm font-bold uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-slate-900 text-sm font-bold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {fees.map((fee) => (
                                    <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 text-sm font-bold">{fee.title}</span>
                                                <span className="text-xs text-slate-500">{fee.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-primary font-bold">₦{Number(fee.amount).toLocaleString()}</td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">{fee.session}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{fee.category}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => openModal(fee)}
                                                    className="text-primary hover:text-green-700 font-bold text-sm flex items-center gap-1 transition-colors"
                                                >
                                                    <span className="material-icons-round text-base">edit</span> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(fee.id)}
                                                    className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-1 transition-colors"
                                                >
                                                    <span className="material-icons-round text-base">delete</span> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>


                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                    <p className="text-sm text-slate-500">Showing {fees.length} fees</p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 text-sm font-bold opacity-50 cursor-not-allowed">Previous</button>
                        <button className="px-3 py-1 bg-primary text-white border border-primary rounded-lg text-sm font-bold shadow-sm">1</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">2</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">3</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {/* Help Banner */}
            <div className="p-6 bg-primary/5 rounded-xl border border-dashed border-primary/30 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                    <span className="material-icons-round text-2xl">info</span>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">Need help configuring fees?</h4>
                    <p className="text-slate-600 text-sm">Review the <a className="underline font-bold hover:text-primary transition-colors" href="#">institutional financial guidelines</a> for the 2025/2026 academic session.</p>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <span className="font-bold text-lg text-slate-900">{editingFee ? 'Edit Fee' : 'Add New Fee'}</span>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <span className="material-icons-round">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Fee Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900"
                                        placeholder="e.g. NACOS Membership Fee"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Category</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900"
                                        placeholder="e.g. Departmental, Faculty"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Amount (₦)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900"
                                        placeholder="5000"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Academic Session</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900"
                                        placeholder="e.g. 2024/2025"
                                        value={formData.session}
                                        onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">Description</label>
                                    <textarea
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 h-24 resize-none"
                                        placeholder="Brief description of the fee"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 flex gap-3 justify-end border-t border-slate-100">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed" disabled={saving}>
                                    {saving ? 'Saving...' : editingFee ? 'Update Fee' : 'Create Fee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
