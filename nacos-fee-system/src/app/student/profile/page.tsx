'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface StudentData {
    student: {
        id: string;
        fullName: string;
        matricNumber: string;
        email: string;
        department: string;
        level: string;
    };
}

export default function ProfilePage() {
    const [data, setData] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        department: '',
        level: '',
    });
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Reusing dashboard endpoint since it has all student details
                const response = await fetch('/api/student/dashboard');
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                    setFormData({
                        fullName: result.student.fullName,
                        department: result.student.department,
                        level: result.student.level,
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        try {
            const response = await fetch('/api/student/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setData(prev => prev ? {
                    ...prev,
                    student: {
                        ...prev.student,
                        fullName: result.student.fullName,
                        department: result.student.department,
                        level: result.student.level,
                    }
                } : null);
                setIsEditing(false);
                router.refresh();
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
                <p>Failed to load profile data.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">My Profile</h2>
                <p className="text-slate-500 mt-2">Manage your personal information and account settings.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Profile Header Background */}
                <div className="h-32 bg-primary/10 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
                </div>

                <div className="px-8 pb-8">
                    {/* Avatar - Negative Margin to overlap header */}
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-md">
                            <span className="text-4xl font-bold text-slate-400">
                                {data.student.fullName.charAt(0)}
                            </span>
                        </div>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-primary text-white border border-primary px-4 py-2 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
                                >
                                    {saving ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons-round text-lg">save</span>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <span className="material-icons-round text-lg">edit</span>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="mb-8">
                        {isEditing ? (
                            <div className="max-w-md">
                                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full text-2xl font-bold text-slate-900 border-b-2 border-slate-200 focus:border-primary outline-none px-0 py-1 bg-transparent placeholder-slate-300"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-slate-900">{data.student.fullName}</h1>
                                <p className="text-slate-500 font-medium">{data.student.department}</p>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Matriculation Number</label>
                                <p className="font-mono font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{data.student.matricNumber}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Email Address</label>
                                <p className="font-medium text-slate-700">{data.student.email}</p>
                            </div>
                            {isEditing && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full font-medium text-slate-700 border border-slate-200 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {isEditing ? (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Level</label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full font-medium text-slate-700 border border-slate-200 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                                    >
                                        <option value="100">100 Level</option>
                                        <option value="200">200 Level</option>
                                        <option value="300">300 Level</option>
                                        <option value="400">400 Level</option>
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Level</label>
                                    <p className="font-medium text-slate-700">{data.student.level} Level</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Account Status</label>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-slate-100 pt-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Account Settings</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <span className="material-icons-round">lock</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Change Password</p>
                                        <p className="text-xs text-slate-500">Update your account password</p>
                                    </div>
                                </div>
                                <span className="material-icons-round text-slate-400">chevron_right</span>
                            </button>

                            <button className="w-full text-left p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                                        <span className="material-icons-round">history</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Login History</p>
                                        <p className="text-xs text-slate-500">View recent account activity</p>
                                    </div>
                                </div>
                                <span className="material-icons-round text-slate-400">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
