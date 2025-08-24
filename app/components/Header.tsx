// app/components/Header.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Menu, X, User } from 'lucide-react';
import { auth } from '@/app/firebase/config';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/app/context/AuthContext';

const Header = () => {
    const { user, setIsModalOpen } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleSignOut = async () => {
        await signOut(auth);
    };

    return (
        <header className="py-4 px-4 sm:px-8 lg:px-16 absolute top-0 left-0 right-0 z-50 bg-transparent">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-wider flex items-center gap-2 cursor-pointer"><Gamepad2 /> AIRENA</Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Browser</a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Categories</a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Blogs</a>
                </nav>
                <div className="hidden md:block">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-300 flex items-center gap-2"><User size={16} /> {user.displayName || user.email || user.phoneNumber}</span>
                            <button onClick={handleSignOut} className="bg-red-500/80 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm">Sign Out</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105">Sign In</button>
                    )}
                </div>
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;