'use client';

import { useEffect, useState } from 'react';

interface ClearanceData {
    student: {
        fullName: string;
        matricNumber: string;
        department: string;
        level: string;
    };
    clearance: {
        status: 'cleared' | 'uncleared';
        updatedAt: string;
    };
}

export default function StudentClearancePage() {
    const [data, setData] = useState<ClearanceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/student/dashboard'); // Reusing dashboard data as it has clearance status
                const result = await response.json();
                if (response.ok) {
                    setData({
                        student: result.student,
                        clearance: {
                            status: result.clearanceStatus,
                            updatedAt: new Date().toISOString() // Mock update time for now or fetch from DB if needed
                        }
                    });
                }
            } catch (err) {
                console.error('Error fetching clearance:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return null;

    const isCleared = data.clearance.status === 'cleared';

    return (
        <div className="max-w-7xl mx-auto">
            <style jsx global>{`
                .certificate-border {
                    border: 20px solid transparent;
                    border-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H100V100H0V0ZM5 5V95H95V5H5Z' fill='%2300873E'/%3E%3C/svg%3E") 30 stretch;
                }
                @media print {
                    .no-print { display: none !important; }
                    .print-area { margin: 0; padding: 0; border: none; box-shadow: none; }
                    body { background: white; }
                    /* Hide sidebar and other layout elements */
                    aside, header { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; max-width: none !important; }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Clearance Status</h2>
                </div>
                {data.student && (
                    <div className="flex items-center gap-4">
                        <button className="bg-white p-2.5 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors relative">
                            <span className="material-icons-round text-slate-500">notifications</span>
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 bg-white pr-4 pl-2 py-2 rounded-full shadow-sm border border-slate-200">
                            <div className="text-right hidden sm:block leading-tight">
                                <p className="text-sm font-semibold text-slate-900">{data.student.fullName}</p>
                                <p className="text-xs text-slate-500">{data.student.matricNumber}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                {data.student.fullName.charAt(0)}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {isCleared ? (
                <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div>
                            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                                <span className="material-icons-round">verified</span>
                                Certificate Ready
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">Your NACOS association fee clearance certificate is ready for download.</p>
                        </div>
                        <button
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-primary/20"
                            onClick={() => window.print()}
                        >
                            <span className="material-icons-round text-xl">download</span>
                            Download Clearance (PDF)
                        </button>
                    </div>

                    <div className="print-area relative bg-white border-8 border-double border-slate-200 p-8 md:p-16 shadow-2xl rounded-sm max-w-4xl mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                            <img alt="Watermark" className="w-full max-w-lg grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRDiMOek-iYmrgosKuIvxUL9TB41CB9_XddluTBvCYVlbMGDJxEMG_D87Gq3RlPcDR4MMEv2B8Ji3ZGiKeWj4cL7ayjAm9zGHAexvRZqXY16DFanP6ne95uVUFeA1PRSI4xhmLuOAY_IoMXXzDb-WrQNF5_Cza2cX6JHz24WE8BoZjig9K9wTUK3b6Yo-cw-ijRah_d4pGSiaFOcSoiTUiDMy_4fKycAcY5uQJju0OZwq8-vvoYoLYHNxlSlEKoHb9dBJvdi7DL9s" />
                        </div>
                        <div className="relative z-10 text-center mb-12">
                            <img
                                alt="NACOS Logo"
                                className="w-24 h-24 mx-auto mb-6 object-contain"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAyopBYEjY2JWCS9Z1xfMQhVdY3VZeUklB1w3wTkaHnyynTkmlvMDjH1x2UN57myWX2Oj6sry1n_1KIQyaeb08COdUAlbwkiVzudDUhnhFcYj-ol0pb6j9qi4BeaQSGx924jnwIzcVi1NgGEnNJoK7OBkf39zPeB5-wiEp-ZhvqEVe7YnrqBrMlwfeUFWqwigJwNugz7p_W3tfRtGznunDRCIeIcJBzJ5zB-x3kdoRFsfb610BUDanHNHAdr9eqWqXd3x0Ddr4rMg"
                            />
                            <h3 className="text-primary font-bold tracking-widest text-sm uppercase mb-2">Nigeria Association of Computing Students</h3>
                            <h4 className="text-slate-600 font-medium text-lg mb-4">SACOETEC Chapter Higher Institution</h4>
                            <div className="h-1 w-32 bg-primary mx-auto"></div>
                        </div>
                        <div className="relative z-10 flex justify-center mb-12">
                            <div className="border-4 border-primary/30 p-2 rounded-full">
                                <div className="bg-primary px-10 py-3 rounded-full flex items-center gap-3 shadow-xl">
                                    <span className="material-icons-round text-white text-3xl">verified</span>
                                    <span className="text-white font-bold text-2xl tracking-[0.2em]">CLEARED</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative z-10 max-w-2xl mx-auto text-center">
                            <p className="font-display text-2xl mb-8 italic text-slate-600">This is to certify that</p>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 uppercase tracking-tight">{data.student.fullName}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-left bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Matriculation Number</label>
                                    <p className="text-lg font-semibold font-mono">{data.student.matricNumber}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Department</label>
                                    <p className="text-lg font-semibold">{data.student.department}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Session</label>
                                    <p className="text-lg font-semibold">2025/2026 Academic Session</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Verification Code</label>
                                    <p className="text-lg font-semibold font-mono text-primary">NAC-{data.student.matricNumber.slice(-4)}-SACO</p>
                                </div>
                            </div>
                            <p className="mt-12 text-slate-600 leading-relaxed">
                                Has successfully fulfilled all financial obligations and membership requirements for the
                                <span className="font-bold text-slate-800 ml-1">Nigeria Association of Computing Students (NACOS)</span>
                                and is hereby cleared for all academic and graduation proceedings for the current session.
                            </p>
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-end justify-between mt-16 pt-12 border-t border-slate-100">
                            <div className="text-center md:text-left mb-8 md:mb-0">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-8">Issued on: {new Date().toLocaleDateString()}</p>
                                <div className="mb-2">
                                    <img
                                        alt="Digital Signature"
                                        className="h-12"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXI9aAUP5LcBGDfurqqo6ollsnGWsFhHEeINMP-6taQBVrtCWyq1tz6CePSVNln7aiydKgwfSskt_MeVKoNe7CWDcr2GWdE-b6XWQ9k94znQ1ompHABkR5Q7pwd0x59OYycrRzgg3tURljRyO9Y1tTZjKnkx3a1LbmXs2gRen5Pm8PJdjRFfcIxr8EYu9m-Y5CN-yQ1kdh4EscVtZN7dUZ5xZ5viyPSEJkUtdS_nIivMCBrAeAlpUibnoPaJvBqOUL6W1PGD8rac4"
                                    />
                                </div>
                                <p className="font-bold text-slate-800">Prof. Ibrahim K. Musa</p>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Departmental Head</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <div className="absolute inset-0 border-2 border-primary/40 border-dashed rounded-full animate-spin-slow"></div>
                                    <img
                                        alt="Digital Stamp"
                                        className="w-24 h-24 opacity-60"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBURCLK6OvEins1ntdKLtKFMk4DmrlajjbuPkI4BJsXKX77nqBe4bxQOWykgdLCVUyBZJSpjk9rjx_oRiMN8KOrFn39QF3zR2iQel_veQaCgSCKsacZl80Fr704qsoCJem0asE7Hp8_WqvG0kFwOqOxMRXuRdtKhyjSUTrTOKbjf2y9sEYVSyyw-BvyZRuOE8OKSZTOOYN6X2BElqePqionhjOsI1_F1lcksZARwpIPNnB7EWs7x5705dGoJ6v0c4cmUJrtfVBLv0"
                                    />
                                    <div className="absolute -bottom-2 bg-white px-3 py-0.5 border border-primary text-[10px] font-bold text-primary rounded-full">
                                        VERIFIED DIGITAL STAMP
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons-round text-5xl">pending_actions</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Clearance Pending</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        You have not met all clearance requirements yet. Please ensure all fees are paid to generate your clearance certificate.
                    </p>
                </div>
            )}

            <div className="mt-8 text-center no-print">
                <p className="text-slate-500 text-sm">
                    Need help? Contact the IT Service Desk or the NACOS Secretariat.
                </p>
                <div className="mt-4 flex justify-center gap-6">
                    <a className="text-primary text-sm font-semibold hover:underline" href="#">Support Portal</a>
                    <a className="text-primary text-sm font-semibold hover:underline" href="#">Contact Dean</a>
                    <a className="text-primary text-sm font-semibold hover:underline" href="#">Privacy Policy</a>
                </div>
            </div>
        </div>
    );
}
