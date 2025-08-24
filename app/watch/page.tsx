// app/watch/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AppImage from '@/app/components/AppImage';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

interface Content {
    title: string;
    description: string;
    image: string;
}

const WatchPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('games');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="bg-black h-screen flex items-center justify-center text-white">
                <p>Loading & Verifying Access...</p>
            </div>
        );
    }

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
        <div className="bg-black text-white">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center space-x-4 mb-8">
                        <button onClick={() => setActiveTab('games')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'games' ? 'bg-emerald-500' : 'bg-gray-800'}`}>Games</button>
                        <button onClick={() => setActiveTab('sports')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'sports' ? 'bg-emerald-500' : 'bg-gray-800'}`}>Sports</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {content.map((item, index) => (
                            <div key={index} className="bg-[#181818]/50 rounded-lg overflow-hidden">
                                <AppImage src={item.image} alt={item.title} className="w-full h-48 object-cover" fallbackText={item.title} />
                                <div className="p-4">
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                    <p className="text-gray-400">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default WatchPage;
