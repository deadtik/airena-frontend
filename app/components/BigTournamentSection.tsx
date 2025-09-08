"use client";
import React from 'react';
import { Swords, UserCircle } from 'lucide-react';

const BigTournamentSection = () => (
    <section className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="container mx-auto relative bg-gradient-to-r from-emerald-500/20 via-green-500/10 to-teal-500/20 rounded-2xl p-8 overflow-hidden border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                
                {/* Player One Icon */}
                <div className="text-center space-y-3">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30 shadow-lg shadow-emerald-900/50">
                        <UserCircle size={80} className="text-emerald-400 opacity-70" />
                    </div>
                    <h3 className="text-xl font-bold text-white/90">Player One</h3>
                </div>
                
                {/* Center Content */}
                <div className="text-center space-y-4 order-first md:order-none max-w-lg">
                    <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                        <Swords className="text-emerald-400" /> 
                        Join The Big Tournament 
                        <Swords className="text-emerald-400" />
                    </h2>
                    <p className="text-gray-300">
                        Welcome to Airena - The real generation streaming platform for gamers. Join the big tournament and win exciting prizes.
                    </p>
                    <button className="bg-white text-black px-10 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-md">
                        1 vs 1
                    </button>
                </div>

                {/* Player Two Icon */}
                <div className="text-center space-y-3">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30 shadow-lg shadow-emerald-900/50">
                        <UserCircle size={80} className="text-emerald-400 opacity-70" />
                    </div>
                    <h3 className="text-xl font-bold text-white/90">Player Two</h3>
                </div>

            </div>
        </div>
    </section>
);

export default BigTournamentSection;

