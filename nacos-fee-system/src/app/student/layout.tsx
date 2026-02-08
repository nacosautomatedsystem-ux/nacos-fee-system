'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StudentSidebar from '@/components/student/Sidebar';

interface StudentData {
    fullName: string;
    matricNumber: string;
}

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [studentData, setStudentData] = useState<StudentData | null>(null);

    // Auto-open on desktop on mount and fetch student data
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        if (mediaQuery.matches) {
            setSidebarOpen(true);
        }

        // Fetch student data for header
        const fetchStudentData = async () => {
            try {
                const response = await fetch('/api/student/dashboard');
                if (response.ok) {
                    const result = await response.json();
                    setStudentData({
                        fullName: result.student.fullName,
                        matricNumber: result.student.matricNumber,
                    });
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };
        fetchStudentData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-display">
            <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
                {/* Header - Visible on Mobile AND Desktop now */}
                <header className="flex items-center justify-between p-3 md:p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 focus:outline-none"
                        >
                            <span className="material-icons-round">{sidebarOpen ? 'menu_open' : 'menu'}</span>
                        </button>

                        <div className="flex items-center gap-2 ml-1">
                            <img
                                alt="NACOS Logo"
                                className="w-7 h-7 md:w-8 md:h-8 object-contain"
                                src="/images/nacos-logo.png"
                            />
                            <span className="font-bold text-primary text-sm md:text-base md:hidden">NACOS</span>
                            <span className={`font-bold text-primary text-sm md:text-base hidden md:block ${sidebarOpen ? 'opacity-0 w-0' : 'opacity-100 w-auto'} transition-all overflow-hidden whitespace-nowrap`}>
                                NACOS
                            </span>
                        </div>
                    </div>

                    {/* Notification and User Card */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link href="/student/notifications">
                            <button className="bg-white p-1.5 sm:p-2 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors relative">
                                <span className="material-icons-round text-slate-500 text-[18px] sm:text-[20px]">notifications</span>
                                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                        </Link>
                        {studentData && (
                            <Link href="/student/profile">
                                <div className="flex items-center gap-1.5 sm:gap-2 bg-white pr-1.5 sm:pr-3 pl-1 sm:pl-1.5 py-1 sm:py-1.5 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div className="text-right hidden md:block leading-tight">
                                        <p className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">{studentData.fullName}</p>
                                        <p className="text-[10px] text-slate-500">{studentData.matricNumber}</p>
                                    </div>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] sm:text-xs">
                                        {studentData.fullName.charAt(0)}
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
