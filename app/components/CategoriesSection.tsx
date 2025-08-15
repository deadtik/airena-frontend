// app/components/CategoriesSection.tsx
"use client";
import React, { useState } from 'react';

const CategoriesSection = () => {
    const [activeTab, setActiveTab] = useState('Game');
    const categories = ["Esports", "Gaming", "Football", "Basketball", "Racing", "Tennis", "Tournaments", "Live Events", "Streaming", "Entertainment"];
    
    return (
        <section className="py-8">
            <div className="container mx-auto text-center">
                 <div className="flex justify-center items-center space-x-4 mb-4">
                    <button 
                        onClick={() => setActiveTab('Game')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'Game' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                        Game
                    </button>
                    <button 
                        onClick={() => setActiveTab('Sports')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'Sports' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                        Sports
                    </button>
                </div>
                <div className="flex flex-wrap justify-center gap-3 px-4">
                    {categories.map(cat => (
                        <button key={cat} className="bg-gray-800 text-gray-300 px-4 py-1.5 rounded-full text-sm hover:bg-gray-700 hover:text-white transition-colors">{cat}</button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
