'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
    const [activeSession, setActiveSession] = useState('2025/2026');
    const [activeSemester, setActiveSemester] = useState('1st');
    const [latePaymentWindow, setLatePaymentWindow] = useState(true);
    const [feeConfirmationEmail, setFeeConfirmationEmail] = useState(true);
    const [paymentDeadlineSMS, setPaymentDeadlineSMS] = useState(true);
    const [adminAuditAlerts, setAdminAuditAlerts] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSaveAll = async () => {
        setSaving(true);
        // Simulate save operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert('Settings saved successfully!');
    };

    return (
        <div className="p-8 space-y-8 font-display text-slate-900">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex min-w-72 flex-col gap-1">
                    <p className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900">System Settings</p>
                    <p className="text-primary/70 text-base font-normal leading-normal">Configure global institution parameters and access controls for the 2025/2026 session.</p>
                </div>
                <button
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="flex items-center justify-center rounded-lg h-11 bg-primary px-6 text-white font-bold transition-all hover:bg-green-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Academic Session Management */}
                <div className="flex flex-col bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-icons-round text-primary p-2 bg-primary/10 rounded-lg">event</span>
                        <h2 className="text-slate-900 text-xl font-bold leading-tight">Academic Session</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-900">Current Active Session</label>
                            <select
                                value={activeSession}
                                onChange={(e) => setActiveSession(e.target.value)}
                                className="bg-primary/5 border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm p-3"
                            >
                                <option>2025/2026 Academic Session</option>
                                <option>2024/2025 Academic Session</option>
                                <option>2023/2024 Academic Session</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-900">Active Semester</label>
                            <div className="flex gap-4">
                                <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 w-full cursor-pointer transition-all ${activeSemester === '1st' ? 'bg-primary/5 border-primary' : 'bg-white border-slate-200 hover:bg-slate-50'
                                    }`}>
                                    <input
                                        checked={activeSemester === '1st'}
                                        onChange={() => setActiveSemester('1st')}
                                        className="text-primary focus:ring-primary"
                                        name="semester"
                                        type="radio"
                                    />
                                    <span className="text-sm font-medium">1st Semester</span>
                                </label>
                                <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 w-full cursor-pointer transition-all ${activeSemester === '2nd' ? 'bg-primary/5 border-primary' : 'bg-white border-slate-200 hover:bg-slate-50'
                                    }`}>
                                    <input
                                        checked={activeSemester === '2nd'}
                                        onChange={() => setActiveSemester('2nd')}
                                        className="text-primary focus:ring-primary"
                                        name="semester"
                                        type="radio"
                                    />
                                    <span className="text-sm font-medium">2nd Semester</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <div>
                                <p className="text-sm font-bold">Late Payment Window</p>
                                <p className="text-xs text-slate-600">Automatically apply late fees after deadline</p>
                            </div>
                            <button
                                onClick={() => setLatePaymentWindow(!latePaymentWindow)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${latePaymentWindow ? 'bg-primary' : 'bg-slate-300'
                                    }`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${latePaymentWindow ? 'translate-x-5' : 'translate-x-0'
                                    }`}></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification Triggers */}
                <div className="flex flex-col bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-icons-round text-primary p-2 bg-primary/10 rounded-lg">campaign</span>
                        <h2 className="text-slate-900 text-xl font-bold leading-tight">Notification Triggers</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-slate-100 pb-4">
                            <div className="flex gap-4">
                                <span className="material-icons-round text-slate-500">mail</span>
                                <div>
                                    <p className="text-sm font-bold">Fee Confirmation Email</p>
                                    <p className="text-xs text-slate-600">Send receipt immediately after payment</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFeeConfirmationEmail(!feeConfirmationEmail)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${feeConfirmationEmail ? 'bg-primary' : 'bg-slate-300'
                                    }`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${feeConfirmationEmail ? 'translate-x-5' : 'translate-x-0'
                                    }`}></span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100 pb-4">
                            <div className="flex gap-4">
                                <span className="material-icons-round text-slate-500">sms</span>
                                <div>
                                    <p className="text-sm font-bold">Payment Deadline SMS</p>
                                    <p className="text-xs text-slate-600">Notify 3 days before session closing</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPaymentDeadlineSMS(!paymentDeadlineSMS)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${paymentDeadlineSMS ? 'bg-primary' : 'bg-slate-300'
                                    }`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${paymentDeadlineSMS ? 'translate-x-5' : 'translate-x-0'
                                    }`}></span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100 pb-4">
                            <div className="flex gap-4">
                                <span className="material-icons-round text-slate-500">notifications_active</span>
                                <div>
                                    <p className="text-sm font-bold">Admin Audit Alerts</p>
                                    <p className="text-xs text-slate-600">Notify Super Admin of high-value clearances</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAdminAuditAlerts(!adminAuditAlerts)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${adminAuditAlerts ? 'bg-primary' : 'bg-slate-300'
                                    }`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${adminAuditAlerts ? 'translate-x-5' : 'translate-x-0'
                                    }`}></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Admin Roles Management */}
                <div className="flex flex-col bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-icons-round text-primary p-2 bg-primary/10 rounded-lg">shield_person</span>
                        <h2 className="text-slate-900 text-xl font-bold leading-tight">Admin User Roles</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border-2 border-primary rounded-xl bg-primary/5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">Super Admin</span>
                                <span className="material-icons-round text-primary">verified</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-4 leading-relaxed">Full system access, including financial overrides, role management, and audit deletion.</p>
                            <button className="text-sm font-bold text-primary underline underline-offset-4 hover:text-green-700 transition-colors">Manage Permissions</button>
                        </div>
                        <div className="p-4 border border-slate-200 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Moderator</span>
                                <span className="material-icons-round text-slate-500">assignment_ind</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-4 leading-relaxed">Limited access: view clearances, process student requests, generate standard reports.</p>
                            <button className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">Manage Permissions</button>
                        </div>
                    </div>
                </div>

                {/* System Maintenance Mode */}
                <div className="flex flex-col bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-icons-round text-red-600 p-2 bg-red-100 rounded-lg">warning</span>
                        <h2 className="text-slate-900 text-xl font-bold leading-tight">System-wide Control</h2>
                    </div>
                    <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <h3 className="text-red-700 font-bold text-base mb-1">Maintenance Mode</h3>
                                <p className="text-red-600 text-xs leading-normal">Activating this will block all student access and fee payments. Only administrators with a direct portal link will be able to log in. Use during database upgrades or institution holidays.</p>
                            </div>
                            <button
                                onClick={() => setMaintenanceMode(!maintenanceMode)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${maintenanceMode ? 'bg-red-600' : 'bg-red-200'
                                    }`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                                    }`}></span>
                            </button>
                        </div>
                        <div className="mt-6 flex flex-col gap-3">
                            <label className="text-xs font-bold text-red-700">Maintenance Message (Visible to Students)</label>
                            <textarea
                                value={maintenanceMessage}
                                onChange={(e) => setMaintenanceMessage(e.target.value)}
                                className="w-full text-sm bg-white border-red-200 rounded-lg focus:ring-red-500 focus:border-red-500 min-h-[80px]"
                                placeholder="Portal is undergoing scheduled maintenance. Please check back in 2 hours."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <span className="material-icons-round">database</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-medium">Database Status</p>
                        <p className="text-base font-bold text-primary">Healthy (99.9%)</p>
                    </div>
                </div>
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <span className="material-icons-round">security</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-medium">Last Backup</p>
                        <p className="text-base font-bold">14 mins ago</p>
                    </div>
                </div>
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <span className="material-icons-round">person_add</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-medium">Active Admins</p>
                        <p className="text-base font-bold">4 Users Online</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
