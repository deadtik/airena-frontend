// app/components/Header.tsx
"use client";
import React, { useState } from 'react';
import { Gamepad2, Menu, X } from 'lucide-react';

const Header = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className="py-4 px-4 sm:px-8 lg:px-16 absolute top-0 left-0 right-0 z-50 bg-transparent">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-wider flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}><Gamepad2 /> AIRENA</h1>
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Browser</a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Categories</a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Blogs</a>
                </nav>
                <div className="hidden md:block">
                    <a href="#" className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105">Sign In</a>
                </div>
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden mt-4 p-4 bg-[#181818] rounded-lg">
                    <nav className="flex flex-col items-center space-y-4">
                        <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">Browser</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">Categories</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">Blogs</a>
                        <a href="#" className="bg-emerald-500 text-white w-full text-center px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors mt-2">Sign In</a>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
