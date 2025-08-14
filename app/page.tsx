"use client";
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { PlayCircle, Crown, Trophy, Calendar, Info, UserCircle, Menu, X, Gamepad2, Swords, Newspaper } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Player {
  rank: number;
  name: string;
  score: string;
  prize: string;
}

interface Slide {
    image: string;
    title: string;
    subtitle: string;
}

// --- REUSABLE COMPONENTS ---

// Generic Image component with error handling
const AppImage: React.FC<{ src: string; alt: string; className: string; fallbackText: string; }> = ({ src, alt, className, fallbackText }) => (
    <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/1920x1080/111111/FFFFFF?text=${encodeURIComponent(fallbackText)}`;
        }}
    />
);


// --- PAGE SECTIONS ---

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className="py-4 px-4 sm:px-8 lg:px-16 absolute top-0 left-0 right-0 z-50 bg-transparent">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-wider flex items-center gap-2"><Gamepad2 /> AIRENA</h1>
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Browser</a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Categories</a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">Blogs</a>
                </nav>
                <div className="hidden md:block">
                    <a href="#" className="bg-white/10 border border-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/20 transition-colors">Sign In</a>
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
                        <a href="#" className="bg-white text-black w-full text-center px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors mt-2">Sign In</a>
                    </nav>
                </div>
            )}
        </header>
    );
};

const HeroSection = () => {
    const slides: Slide[] = [
        {
            image: '/airenaslide1.jpg',
            title: 'The Ultimate Gaming & Sports Streaming Platform',
            subtitle: 'Join the next generation of competitive gaming and sports streaming'
        },
        {
            image: '/airenaslide2.jpg',
            title: 'Live Events, Every Day',
            subtitle: 'Experience the thrill of live competition from around the globe'
        },
        {
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
            title: 'Connect With Your Favorite Creators',
            subtitle: 'Follow, subscribe, and support the streamers you love'
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearTimeout(timer);
    }, [currentSlide, slides.length]);


    return (
        <section className="relative h-screen bg-black">
            <div className="relative h-full w-full overflow-hidden">
                {slides.map((slide, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        <AppImage src={slide.image} alt={slide.title} className="w-full h-full object-cover" fallbackText="Airena Event" />
                         <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white z-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <div className="container mx-auto">
                     <div className="max-w-3xl space-y-4">
                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">{slides[currentSlide].title}</h2>
                        <p className="text-gray-300 text-lg">{slides[currentSlide].subtitle}</p>
                        <div className="flex items-center gap-4 pt-4">
                            <button className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105">Start Watching</button>
                            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"><Info size={20} /> What is Airena?</button>
                        </div>
                    </div>
                    <div className="flex justify-center space-x-2 mt-8">
                        {slides.map((_, index) => (
                            <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide ? 'w-8 bg-emerald-500' : 'w-4 bg-gray-500'}`}></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

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

const FeaturedVideoSection = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <section className="py-16 sm:py-24 px-4 sm:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="relative aspect-video rounded-2xl overflow-hidden group shadow-2xl shadow-emerald-500/10">
                   {isClient && (
                        <ReactPlayer
                            src="https://www.youtube.com/watch?v=e_E9W2vsRbQ"
                            className="react-player"
                            playing
                            loop
                            muted
                            controls={true}
                            width="100%"
                            height="100%"
                        />
                   )}
                </div>
            </div>
        </section>
    );
};


const BigTournamentSection = () => (
    <section className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="container mx-auto relative bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                {/* Player 1 */}
                <div className="w-full md:w-auto flex justify-center">
                    <AppImage src="/player1.jpg" alt="Player Phoenix" className="w-40 md:w-48" fallbackText="Player 1" />
                </div>
                
                {/* Center Content */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3"><Swords/> Join The Big Tournament <Swords/></h2>
                    <p className="text-gray-300 max-w-md mx-auto">Welcome to Airena - The real generation streaming platform for gamers. Join the big tournament and win exciting prizes and show your skills.</p>
                    <button className="bg-white text-black px-10 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all transform hover:scale-105">1 vs 1</button>
                </div>

                {/* Player 2 */}
                <div className="w-full md:w-auto flex justify-center">
                     <AppImage src="/player2.jpg" alt="Player Sage" className="w-40 md:w-48" fallbackText="Player 2" />
                </div>
            </div>
        </div>
    </section>
);


const FoundersClubSection = () => (
    <section className="py-20 sm:py-28 px-4 sm:px-8">
        <div className="container mx-auto text-center max-w-3xl bg-[#181818]/30 backdrop-blur-sm border border-white/5 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3"><Crown/> Join the Founders' Club</h2>
            <p className="text-gray-400 my-4">Be among the first 200 content creators to shape the future of Airena</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <input type="email" placeholder="Enter your email" className="bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                <button type="submit" className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105 whitespace-nowrap">Sign Up Early</button>
            </form>
            <p className="mt-4 text-sm text-gray-500">Only 200 spots available</p>
        </div>
    </section>
);

const LeaderboardSection = () => {
    const players: Player[] = [
        { rank: 1, name: 'ProGamer123', score: '2500', prize: '₹8,00,000' },
        { rank: 2, name: 'Streaming', score: '2300', prize: '₹4,00,000' },
        { rank: 3, name: 'GameMaster', score: '2200', prize: '₹2,00,000' },
        { rank: 4, name: 'ElitePlayer', score: '2100', prize: '₹80,000' },
        { rank: 5, name: 'TopStreamer', score: '2000', prize: '₹40,000' },
    ];
    return (
        <section className="py-16 sm:py-24 px-4 sm:px-8">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8"><h2 className="text-3xl font-bold flex items-center gap-3"><Trophy className="text-emerald-500" /> Tournament Leaderboard</h2></div>
                <div className="bg-[#181818]/50 backdrop-blur-sm border border-white/5 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left">
                            <thead className="border-b border-gray-700/50"><tr>
                                <th className="p-4 text-gray-400 font-semibold tracking-wider">Rank</th>
                                <th className="p-4 text-gray-400 font-semibold tracking-wider">Player</th>
                                <th className="p-4 text-gray-400 font-semibold tracking-wider">Score</th>
                                <th className="p-4 text-gray-400 font-semibold tracking-wider text-right">Prize</th>
                            </tr></thead>
                            <tbody>{players.map((player) => (
                                <tr key={player.rank} className="border-b border-gray-800/50 last:border-b-0 hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 font-bold text-lg">
                                        <div className="w-8 h-8 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-full">
                                            {player.rank}
                                        </div>
                                    </td>
                                    <td className="p-4">{player.name}</td>
                                    <td className="p-4 text-gray-400">{player.score}</td>
                                    <td className="p-4 text-right font-semibold text-emerald-500">{player.prize}</td>
                                </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

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


// --- MAIN PAGE COMPONENT ---
export default function AirenaHomePage() {
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            <style jsx global>{`
                .mouse-gradient-background::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(
                        400px at var(--mouse-x) var(--mouse-y),
                        rgba(29, 78, 216, 0.15),
                        transparent 80%
                    );
                    z-index: -10;
                    pointer-events: none;
                }
            `}</style>
            <div className="bg-black text-white font-sans antialiased relative isolate overflow-x-hidden mouse-gradient-background">
                {/* Background Gradient Glow */}
                <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1-2 rotate-[30deg] bg-gradient-to-tr from-[#059669] to-[#34d399] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                <Header />
                <main>
                    <HeroSection />
                    <CategoriesSection />
                    <FeaturedVideoSection />
                    <BigTournamentSection />
                    <FoundersClubSection />
                    <LeaderboardSection />
                </main>
                <Footer />

                {/* Background Gradient Glow for Leaderboard */}
                <div className="absolute inset-x-0 top-[60%] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                     <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1-2 bg-gradient-to-tr from-[#059669] to-[#34d399] opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
                </div>
            </div>
        </>
    );
}
