"use client";
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import WatchPage from '@/app/components/WatchPage';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

// --- MAIN PAGE COMPONENT ---
export default function AirenaHomePage() {
    const [page, setPage] = useState('home');

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const onNavigate = (newPage: string) => {
        setPage(newPage);
        window.scrollTo(0, 0); // Scroll to top on page change
    };

    return (
        <>
            <style jsx global>{`
                .mouse-gradient-background::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(
                        400px at var(--mouse-x) var(--mouse-y),
                        rgba(29, 78, 216, 0.15),
                        transparent 80%
                    );
                    z-index: -10;
                    pointer-events: none;
                }
            `}</style>
            <div className="bg-black text-white font-sans antialiased relative isolate overflow-x-hidden mouse-gradient-background">
                {/* Background Gradient Glow */}
                <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1-2 rotate-[30deg] bg-gradient-to-tr from-[#059669] to-[#34d399] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                {page === 'home' ? (
                    <HomePage onNavigate={onNavigate} />
                ) : (
                    <>
                        <Header onNavigate={onNavigate} />
                        <WatchPage />
                        <Footer />
                    </>
                )}

                {/* Background Gradient Glow for Leaderboard */}
                <div className="absolute inset-x-0 top-[60%] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                     <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1-2 bg-gradient-to-tr from-[#059669] to-[#34d399] opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
                </div>
            </div>
        </>
    );
}
