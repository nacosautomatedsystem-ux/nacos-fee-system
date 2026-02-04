'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StudentSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { href: '/student/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { href: '/student/fee', icon: 'payments', label: 'Fee Payment' },
        { href: '/student/clearance', icon: 'verified_user', label: 'Clearance Status' },
        // { href: '/student/profile', icon: 'person', label: 'Profile' },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                    <img
                        alt="NACOS Logo"
                        className="w-10 h-10 object-contain"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD68oC07nxdBTV5mNfJR0xfFqLzWk0r0S3lWEsfjqIHSXZtCbIvzsHwlMs7RuGz3sR-oN2l3vknXml6dky4S3KJriM1KSSSOp4kgHm4Hg1UOGUtHeuIHfwrCzEQedszJjiAY_Jik-7cVT93pQqJuOXK2bPQtfjHTZtnTK6temApUKq0N0g0OAOjR0zFhVDBgwOUKgtG_1MDKZQTu1a34Z7w_rLjbCcU_9Y5lVeKfFTJqYGa4dQYYeh63BkzcGPnuezYQvCw4NJqda0"
                    />
                    <div>
                        <h1 className="font-bold text-sm leading-tight text-primary">NACOS</h1>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">Fee Clearance</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()} // Close on mobile navigation
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                                    ${isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}
                                `}
                            >
                                <span className="material-icons-round text-[20px]">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <Link
                        href="/api/auth/logout"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            fetch('/api/auth/logout', { method: 'POST' }).then(() => window.location.href = '/login');
                        }}
                    >
                        <span className="material-icons-round text-[20px]">logout</span>
                        Sign Out
                    </Link>
                </div>
            </aside>
        </>
    );
}
