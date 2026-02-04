'use client';

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
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD68oC07nxdBTV5mNfJR0xfFqLzWk0r0S3lWEsfjqIHSXZtCbIvzsHwlMs7RuGz3sR-oN2l3vknXml6dky4S3KJriM1KSSSOp4kgHm4Hg1UOGUtHeuIHfwrCzEQedszJjiAY_Jik-7cVT93pQqJuOXK2bPQtfjHTZtnTK6temApUKq0N0g0OAOjR0zFhVDBgwOUKgtG_1MDKZQTu1a34Z7w_rLjbCcU_9Y5lVeKfFTJqYGa4dQYYeh63BkzcGPnuezYQvCw4NJqda0"
                    />
                    <div>
                        <h1 className="font-bold text-lg md:text-xl text-primary leading-tight">SACOETEC</h1>
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

            <footer className="py-8 px-6 text-center text-slate-500 text-sm bg-background-light">
                <p>© 2024 SACOETEC Computing Department. All Rights Reserved.</p>
                <div className="mt-2 flex justify-center space-x-6">
                    <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                    <a className="hover:text-primary transition-colors" href="#">Help Center</a>
                </div>
            </footer>
        </>
    );
}
