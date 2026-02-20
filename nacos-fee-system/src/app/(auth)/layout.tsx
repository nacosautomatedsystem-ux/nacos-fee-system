'use client';
import Footer from '@/components/Footer';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-white/80 sticky top-0 z-50 glass-effect border-b border-slate-200">
                <div className="flex items-center space-x-3">
                    <img
                        alt="NACOS Logo"
                        className="h-10 w-10 md:h-12 md:w-12 object-contain"
                        src="/images/nacos-logo.png"
                    />
                    <div>
                        <h1 className="font-bold text-lg md:text-xl text-primary leading-tight">NACOS</h1>
                        <p className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-slate-500">NACOS Fee Clearance System</p>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-background-light">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>

                <div className="w-full max-w-xl bg-white shadow-2xl shadow-slate-200 rounded-3xl overflow-hidden relative z-10 border border-slate-100">
                    {children}
                </div>
            </main>

            <Footer />
        </>
    );
}
