'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/students', label: 'Students', icon: 'groups' },
    { href: '/admin/payments', label: 'Payments', icon: 'payments' },
    { href: '/admin/fees', label: 'Fees Management', icon: 'account_balance_wallet' },
    { href: '/admin/reports', label: 'Reports', icon: 'bar_chart' },
    { href: '/admin/settings', label: 'Settings', icon: 'settings' },
];

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        setLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            setLoggingOut(false);
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 flex items-center space-x-3 border-b border-slate-100">
                    <img
                        alt="NACOS Logo"
                        className="w-10 h-10 object-contain"
                        src="/images/nacos-logo.png"
                    />
                    <div>
                        <h1 className="text-sm font-bold leading-tight text-primary">NACOS</h1>
                        <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Fee Clearance</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <span className="material-icons-round text-[20px]">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 space-y-1">
                    <Link
                        href="/admin/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        <span className="material-icons-round">settings</span>
                        <span>Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                        <span className="material-icons-round">{loggingOut ? 'hourglass_empty' : 'logout'}</span>
                        <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
