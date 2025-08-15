// app/components/WatchPage.tsx
"use client";
import React, { useState } from 'react';
import AppImage from '@/app/components/AppImage';

interface Content {
    title: string;
    description: string;
    image: string;
}

const WatchPage = () => {
    const [activeTab, setActiveTab] = useState('games');

    const gamesContent: Content[] = [
        { title: 'Esports Championship', description: 'The biggest esports event of the year.', image: 'https://images.unsplash.com/photo-1542751371-659545093593?q=80&w=2070&auto=format&fit=crop' },
        { title: 'Digital Mayhem', description: 'A showcase of the latest and greatest digital games.', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop' },
    ];

    const sportsContent: Content[] = [
        { title: 'World Cup Finals', description: 'The final match of the world cup.', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop' },
        { title: 'NBA Finals', description: 'The final series of the NBA season.', image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2071&auto=format&fit=crop' },
    ];

    const content = activeTab === 'games' ? gamesContent : sportsContent;

    return (
        <div className="pt-24 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center space-x-4 mb-8">
                    <button 
                        onClick={() => setActiveTab('games')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'games' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                        Games
                    </button>
                    <button 
                        onClick={() => setActiveTab('sports')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'sports' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                        Sports
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.map((item, index) => (
                        <div key={index} className="bg-[#181818]/50 backdrop-blur-sm border border-white/5 rounded-lg overflow-hidden">
                            <AppImage src={item.image} alt={item.title} className="w-full h-48 object-cover" fallbackText={item.title} />
                            <div className="p-4">
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-gray-400">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WatchPage;
