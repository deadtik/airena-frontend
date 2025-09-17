// app/watch/page.tsx
"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { Upload, Film, Gamepad2, PlayCircle, Clock, Eye } from 'lucide-react';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import dynamic from 'next/dynamic';
// import type { ReactPlayerProps } from 'react-player'; // CORRECT: Import the props type
import UserAvatar from '@/app/components/UserAvatar';

// --- THIS IS THE DEFINITIVE FIX ---
// 1. We dynamically import the component to ensure it only runs on the client-side.
// 2. We use the official ReactPlayerProps type we imported.
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
// ---------------------------------

// Define the shape of a Video object
interface Video {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    category: 'games' | 'sports';
    createdAt: Timestamp;
    authorName: string;
    authorPhotoURL: string | null;
}

// A new, compact and styled component for videos in the "Up Next" list
const VideoListItem = ({ video, onSelect, isSelected }: { video: Video, onSelect: () => void, isSelected: boolean }) => (
    <div 
        onClick={onSelect}
        className={`group relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
            isSelected 
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
                : 'bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20'
        }`}
    >
        <div className="relative w-32 h-20 bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shrink-0 border border-white/10">
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                <PlayCircle className={`w-8 h-8 transition-all duration-300 ${isSelected ? 'text-emerald-400' : 'text-gray-500 group-hover:text-white'}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
        </div>
        <div className="flex-1 overflow-hidden">
            <h4 className={`font-bold text-sm line-clamp-2 transition-colors duration-300 ${
                isSelected ? 'text-emerald-300' : 'text-white group-hover:text-emerald-200'
            }`}>
                {video.title}
            </h4>
            <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-400">{video.authorName}</p>
            </div>
        </div>
        {isSelected && (
            <div className="absolute right-2 top-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
        )}
    </div>
);

const WatchPage = () => {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'games' | 'sports'>('games');
    const [videos, setVideos] = useState<Video[]>([]);
    const [videosLoading, setVideosLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
        if (user) {
            const fetchVideos = async () => {
                try {
                    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
                    const querySnapshot = await getDocs(q);
                    const videosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
                    setVideos(videosData);
                } catch (err) {
                    console.error("Failed to fetch videos", err);
                } finally {
                    setVideosLoading(false);
                }
            };
            fetchVideos();
        }
    }, [user, loading, router]);

    useEffect(() => {
        const handleInteraction = () => setHasInteracted(true);
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    const filteredVideos = useMemo(() => videos.filter(v => v.category === activeTab), [videos, activeTab]);

    useEffect(() => {
        if (filteredVideos.length > 0) {
            setSelectedVideo(filteredVideos[0]);
        } else {
            setSelectedVideo(null);
        }
    }, [activeTab, videos]); // Depend on 'videos' to update when the initial fetch completes

    if (loading || videosLoading) {
        return (
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                    <p className="text-white mt-4 font-medium">Loading Content...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
            </div>
            
            <Header />
            
            <main className="relative pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div className="text-center md:text-left">
                            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent mb-4">Watch</h1>
                            <p className="text-xl text-gray-300 max-w-md leading-relaxed">Stream the latest from the <span className="text-emerald-400 font-semibold">Airena</span> community.</p>
                        </div>
                        {isAdmin && (
                            <Link 
                                href="/watch/upload" 
                                className="group relative mt-8 md:mt-0 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
                            >
                                <Upload size={20} className="group-hover:rotate-12 transition-transform duration-300" /> Upload Video
                            </Link>
                        )}
                    </div>
                    
                    {/* Category Tabs */}
                    <div className="flex justify-center items-center space-x-6 mb-16">
                         <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-2 shadow-2xl">
                            <button onClick={() => setActiveTab('games')} className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${activeTab === 'games' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}>
                                <Gamepad2 size={20} /> Games
                            </button>
                            <button onClick={() => setActiveTab('sports')} className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${activeTab === 'sports' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}>
                                <Film size={20} /> Sports
                            </button>
                        </div>
                    </div>

                    {filteredVideos.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="relative inline-block">
                                <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                                    <PlayCircle className="w-16 h-16 text-gray-500" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-300 mb-2">No videos found yet</h3>
                            <p className="text-gray-500 max-w-md mx-auto">Be the first to share amazing content in this category!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                {selectedVideo && (
                                    <div className="space-y-8">
                                        <div className="relative group">
                                            <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-white/10 backdrop-blur-sm">
                                                {!hasInteracted && (
                                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                                        <div className="text-center">
                                                            <PlayCircle className="w-16 h-16 text-white mb-4 mx-auto animate-pulse" />
                                                            <p className="text-white text-lg font-medium">Click anywhere to enable playback</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <ReactPlayer 
                                                    src={selectedVideo.videoUrl} 
                                                    width="100%" 
                                                    height="100%" 
                                                    playing={hasInteracted} 
                                                    controls={true}
                                                />
                                            </div>
                                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
                                            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">{selectedVideo.title}</h2>
                                            <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                                                <UserAvatar src={selectedVideo.authorPhotoURL} alt={selectedVideo.authorName} size={50} />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-white text-lg">{selectedVideo.authorName}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedVideo.createdAt.toDate().toLocaleDateString()}</div>
                                                        <div className="flex items-center gap-1"><Eye className="w-4 h-4" />Live now</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="prose prose-invert max-w-none"><p className="text-gray-300 leading-relaxed text-lg">{selectedVideo.description}</p></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="sticky top-28">
                                    <div className="flex items-center gap-3 mb-6">
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Up Next</h3>
                                        <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-xl max-h-[800px] overflow-y-auto custom-scrollbar">
                                        <div className="space-y-4">
                                            {filteredVideos.map((video, index) => (
                                                <div key={video.id} className="relative">
                                                    {index > 0 && (<div className="absolute -top-2 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />)}
                                                    <VideoListItem 
                                                        video={video}
                                                        isSelected={selectedVideo?.id === video.id}
                                                        onSelect={() => setSelectedVideo(video)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default WatchPage;