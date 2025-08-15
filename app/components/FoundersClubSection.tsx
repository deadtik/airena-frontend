// app/components/FoundersClubSection.tsx
"use client";
import React from 'react';
import { Crown } from 'lucide-react';

const FoundersClubSection = () => (
    <section className="py-20 sm:py-28 px-4 sm:px-8">
        <div className="container mx-auto text-center max-w-3xl bg-[#181818]/30 backdrop-blur-sm border border-white/5 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3"><Crown/> Join the Founders&apos; Club</h2>
            <p className="text-gray-400 my-4">Be among the first 200 content creators to shape the future of Airena</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <input type="email" placeholder="Enter your email" className="bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                <button type="submit" className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105 whitespace-nowrap">Sign Up Early</button>
            </form>
            <p className="mt-4 text-sm text-gray-500">Only 200 spots available</p>
        </div>
    </section>
);

export default FoundersClubSection;
