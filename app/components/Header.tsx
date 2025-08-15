// app/components/Header.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // Import the Link component
import { Gamepad2, Menu, X } from 'lucide-react';

// The 'onNavigate' prop is no longer needed
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // This helper function closes the mobile menu when a link is clicked
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="py-4 px-4 sm:px-8 lg:px-16 absolute top-0 left-0 right-0 z-50 bg-transparent">
            <div className="container mx-auto flex justify-between items-center">
                {/* The logo now uses a Link to navigate to the homepage */}
                <Link href="/" className="text-2xl font-bold tracking-wider flex items-center gap-2">
                    <Gamepad2 /> AIRENA
                </Link>

                {/* Desktop navigation now uses Link components */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/browse" className="text-gray-300 hover:text-white transition-colors">Browse</Link>
                    <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link>
                    <Link href="/blogs" className="text-gray-300 hover:text-white transition-colors">Blogs</Link>
                </nav>
                
                <div className="hidden md:block">
                    <Link href="/signin" className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105">
                        Sign In
                    </Link>
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu also uses Link components */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 p-4 bg-[#181818] rounded-lg">
                    <nav className="flex flex-col items-center space-y-4">
                        <Link href="/browse" onClick={closeMenu} className="text-gray-300 hover:text-white transition-colors py-2">Browse</Link>
                        <Link href="/categories" onClick={closeMenu} className="text-gray-300 hover:text-white transition-colors py-2">Categories</Link>
                        <Link href="/blogs" onClick={closeMenu} className="text-gray-300 hover:text-white transition-colors py-2">Blogs</Link>
                        <Link href="/signin" onClick={closeMenu} className="bg-emerald-500 text-white w-full text-center px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors mt-2">
                            Sign In
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;