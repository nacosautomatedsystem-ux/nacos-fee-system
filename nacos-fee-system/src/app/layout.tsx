import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NACOS Fee Clearance System | SACOETEC",
  description: "Automated NACOS Fee Clearance System for Sikiru Adetona College of Education, Science and Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      </head>
      <body className="bg-white text-slate-800 transition-colors duration-300 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
