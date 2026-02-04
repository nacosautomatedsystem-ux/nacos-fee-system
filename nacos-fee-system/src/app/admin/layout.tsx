'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Auto-open on desktop
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)'); // lg breakpoint
        if (mediaQuery.matches) {
            setSidebarOpen(true);
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isLoginPage) {
        return (
            <div className="min-h-screen bg-white font-display">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-display text-slate-900">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
                {/* Admin Header */}
                <header className={`h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-all ${scrolled ? 'shadow-sm' : ''}`}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                        >
                            <span className="material-icons-round">{sidebarOpen ? 'menu_open' : 'menu'}</span>
                        </button>

                        <div className="hidden md:flex items-center bg-slate-100 px-3 py-1.5 rounded-lg w-64 lg:w-96">
                            <span className="material-icons-round text-slate-400 text-sm">search</span>
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-slate-500 ml-2"
                                placeholder="Search students, receipts..."
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle Removed - Enforced Light Mode */}

                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
                            <span className="material-icons-round">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center space-x-3 cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold leading-none text-slate-900">Admin User</p>
                                <p className="text-[11px] text-slate-500 mt-1">Super Administrator</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/20">
                                AU
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
