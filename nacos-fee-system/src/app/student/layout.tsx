'use client';

import { useState, useEffect } from 'react';
import StudentSidebar from '@/components/student/Sidebar';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Default to false (mobile friendly initial state)

    // Auto-open on desktop on mount
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        if (mediaQuery.matches) {
            setSidebarOpen(true);
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-display">
            <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
                {/* Header - Visible on Mobile AND Desktop now */}
                <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        {/* Show hamburger on all screens, but logic differs slightly maybe? No, logic is same: toggle. */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 focus:outline-none"
                        >
                            <span className="material-icons-round">{sidebarOpen ? 'menu_open' : 'menu'}</span>
                        </button>

                        <div className="flex items-center gap-2 ml-2">
                            <img
                                alt="NACOS Logo"
                                className="w-8 h-8 object-contain"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD68oC07nxdBTV5mNfJR0xfFqLzWk0r0S3lWEsfjqIHSXZtCbIvzsHwlMs7RuGz3sR-oN2l3vknXml6dky4S3KJriM1KSSSOp4kgHm4Hg1UOGUtHeuIHfwrCzEQedszJjiAY_Jik-7cVT93pQqJuOXK2bPQtfjHTZtnTK6temApUKq0N0g0OAOjR0zFhVDBgwOUKgtG_1MDKZQTu1a34Z7w_rLjbCcU_9Y5lVeKfFTJqYGa4dQYYeh63BkzcGPnuezYQvCw4NJqda0"
                            />
                            <span className="font-bold text-primary md:hidden">NACOS</span> {/* Hide text on desktop if breadcrumbs used, or keep it. Keeping it hidden on Desktop as usually sidebar has logo. But if sidebar closed? */}
                            <span className={`font-bold text-primary hidden md:block ${sidebarOpen ? 'opacity-0 w-0' : 'opacity-100 w-auto'} transition-all overflow-hidden whitespace-nowrap`}>
                                NACOS
                            </span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
