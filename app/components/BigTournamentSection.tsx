// app/components/BigTournamentSection.tsx
"use client";
import React from 'react';
import { Swords } from 'lucide-react';
import AppImage from '@/app/components/AppImage';

const BigTournamentSection = () => (
    <section className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="container mx-auto relative bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                {/* Player 1 */}
                <div className="w-full md:w-auto flex justify-center">
                    <AppImage src="/player1.jpg" alt="Player Phoenix" className="w-40 md:w-100" fallbackText="Player 1" />
                </div>
                
                {/* Center Content */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3"><Swords/> Join The Big Tournament <Swords/></h2>
                    <p className="text-gray-300 max-w-md mx-auto">Welcome to Airena - The real generation streaming platform for gamers. Join the big tournament and win exciting prizes and show your skills.</p>
                    <button className="bg-white text-black px-10 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all transform hover:scale-105">1 vs 1</button>
                </div>

                {/* Player 2 */}
                <div className="w-full md:w-auto flex justify-center">
                     <AppImage src="/player2.jpg" alt="Player Sage" className="w-40 md:w-100" fallbackText="Player 2" />
                </div>
            </div>
        </div>
    </section>
);

// I guess I fixed the mismatch

export default BigTournamentSection;

