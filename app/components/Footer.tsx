// app/components/Footer.tsx
"use client";
import React from 'react';

const Footer = () => (
    <footer className="bg-transparent border-t border-gray-800/50 mt-16 sm:mt-24">
        <div className="container mx-auto py-8 px-4 sm:px-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Airena Platform. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
        </div>
    </footer>
);

export default Footer;
