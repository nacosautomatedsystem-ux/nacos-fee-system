'use client';

import React from 'react';

const Footer = () => {
    return (
        <footer className="py-8 px-6 text-center text-slate-500 text-sm mt-auto">
            <p>© 2026 SACOETEC Computing Department. All Rights Reserved.</p>
            <p>
                Built by{' '}
                <a
                    href="https://uplix.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary font-bold transition-colors"
                >
                    UPLIX
                </a>
            </p>
        </footer>
    );
};

export default Footer;
