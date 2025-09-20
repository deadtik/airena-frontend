// app/watch/page.tsx
"use client";
import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { Upload, Film, Gamepad2, PlayCircle, Clock, Eye, Share2, Check } from 'lucide-react';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import dynamic from 'next/dynamic';
import type ReactPlayer from 'react-player';
import UserAvatar from '@/app/components/UserAvatar';

const ReactPlayerComponent = dynamic(() => import('react-player'), { ssr: false });

interface Video {
    id: string; title: string; description: string; videoUrl: string;
    category: 'games' | 'sports'; createdAt: Timestamp; authorName: string;
    authorPhotoURL: string | null; views?: number;
}

const VideoListItem = ({ video, onSelect, isSelected }: { video: Video, onSelect: () => void, isSelected: boolean }) => (
    <div 
        onClick={onSelect}
        className={`group relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
            isSelected 
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 shadow-lg' 
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
        }`}
    >
        <div className="relative w-32 h-20 bg-black rounded-xl overflow-hidden shrink-0 border border-white/10">
            <PlayCircle className={`absolute inset-0 m-auto w-8 h-8 transition-all duration-300 z-10 ${isSelected ? 'text-emerald-400' : 'text-gray-500 group-hover:text-white'}`} />
        </div>
        <div className="flex-1 overflow-hidden">
            <h4 className={`font-bold text-sm line-clamp-2 transition-colors duration-300 ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                {video.title}
            </h4>
            <p className="text-xs text-gray-400 mt-2">{video.authorName}</p>
        </div>
        {isSelected && <div className="absolute right-2 top-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
    </div>
);

const WatchContent = () => {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState<'games' | 'sports'>('games');
    const [videos, setVideos] = useState<Video[]>([]);
    const [videosLoading, setVideosLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push('/');
        if (user) {
            const fetchVideos = async () => {
                try {
                    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
                    const querySnapshot = await getDocs(q);
                    setVideos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video)));
                } catch (err) { console.error("Failed to fetch videos", err); } 
                finally { setVideosLoading(false); }
            };
            fetchVideos();
        }
    }, [user, loading, router]);

    useEffect(() => {
        const handleInteraction = () => setHasInteracted(true);
        window.addEventListener('click', handleInteraction, { once: true });
        return () => window.removeEventListener('click', handleInteraction);
    }, []);

    const filteredVideos = useMemo(() => videos.filter(v => v.category === activeTab), [videos, activeTab]);

    // Handle URL parameter and initial video selection
    useEffect(() => {
        const videoIdFromUrl = searchParams.get('v');
        if (videoIdFromUrl && videos.length > 0) {
            const videoFromUrl = videos.find(v => v.id === videoIdFromUrl);
            if (videoFromUrl) {
                // If there's a video from URL, switch to its category and select it
                setActiveTab(videoFromUrl.category);
                setSelectedVideo(videoFromUrl);
                return;
            }
        }
    }, [searchParams, videos]);

    // Handle video selection when tab changes (only if no URL parameter)
    useEffect(() => {
        const videoIdFromUrl = searchParams.get('v');
        
        // Only auto-select first video if there's no URL parameter
        if (!videoIdFromUrl && filteredVideos.length > 0) {
            setSelectedVideo(filteredVideos[0]);
        } else if (!videoIdFromUrl && filteredVideos.length === 0) {
            setSelectedVideo(null);
        }
    }, [filteredVideos, searchParams]);

    const handleVideoSelect = (video: Video) => {
        setSelectedVideo(video);
        router.push(`/watch?v=${video.id}`, { scroll: false });
    };

    const handleTabChange = (tab: 'games' | 'sports') => {
        setActiveTab(tab);
        // Clear URL parameter when switching tabs manually
        router.push('/watch', { scroll: false });
    };

    const handleShare = () => {
        if (!selectedVideo) return;
        const shareUrl = `${window.location.origin}/watch?v=${selectedVideo.id}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading || videosLoading) {
        return <div className="bg-black h-screen flex items-center justify-center text-white">Loading Content...</div>;
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <Header />
            <main className="relative pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div className="text-center md:text-left">
                            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent mb-4">Watch</h1>
                            <p className="text-xl text-gray-300">Stream the latest from the <span className="font-semibold text-emerald-400">Airena</span> community.</p>
                        </div>
                        {isAdmin && (
                            <Link href="/watch/upload" className="group bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-6 py-3 rounded-2xl font-semibold border border-emerald-500/30 hover:border-emerald-400/50 transition-all flex items-center gap-2">
                                <Upload size={20} /> Upload Video
                            </Link>
                        )}
                    </div>
                    
                    <div className="flex justify-center items-center space-x-6 mb-16">
                         <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-2 shadow-2xl">
                            <button 
                                onClick={() => handleTabChange('games')} 
                                className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                                    activeTab === 'games' 
                                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Gamepad2 size={20} /> Games
                            </button>
                            <button 
                                onClick={() => handleTabChange('sports')} 
                                className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                                    activeTab === 'sports' 
                                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Film size={20} /> Sports
                            </button>
                        </div>
                    </div>

                    {filteredVideos.length === 0 ? (
                        <div className="text-center py-20">
                           <h3 className="text-2xl font-bold text-gray-300 mb-2">No videos found yet</h3>
                           <p className="text-gray-500">Be the first to share content in this category!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                {selectedVideo && (
                                    <div className="space-y-8">
                                        <div className="relative">
                                            <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                                                {!hasInteracted && (
                                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                                        <div className="text-center"><PlayCircle className="w-16 h-16 text-white mb-4 mx-auto animate-pulse" /><p className="text-white text-lg font-medium">Click anywhere to enable playback</p></div>
                                                    </div>
                                                )}
                                                <ReactPlayerComponent src={selectedVideo.videoUrl} width="100%" height="100%" playing={hasInteracted} controls={true} />
                                            </div>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
                                            <h2 className="text-4xl font-bold text-white mb-6">{selectedVideo.title}</h2>
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                                                <div className="flex items-center gap-4">
                                                    <UserAvatar src={selectedVideo.authorPhotoURL} alt={selectedVideo.authorName} size={50} />
                                                    <div>
                                                        <p className="font-semibold text-white text-lg">{selectedVideo.authorName}</p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                                            <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedVideo.createdAt.toDate().toLocaleDateString()}</div>
                                                            <div className="flex items-center gap-1"><Eye className="w-4 h-4" />{selectedVideo.views || 0} views</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={handleShare} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg font-semibold transition-colors">
                                                    {copied ? <><Check size={16}/> Copied!</> : <><Share2 size={16}/> Share</>}
                                                </button>
                                            </div>
                                            <div className="prose prose-invert max-w-none"><p className="text-gray-300 leading-relaxed text-lg">{selectedVideo.description}</p></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="lg:col-span-1">
                                <div className="sticky top-28">
                                    <h3 className="text-2xl font-bold text-white mb-6">Up Next</h3>
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-xl max-h-[800px] overflow-y-auto">
                                        <div className="space-y-4">
                                            {filteredVideos.map((video) => (
                                                <VideoListItem key={video.id} video={video} isSelected={selectedVideo?.id === video.id} onSelect={() => handleVideoSelect(video)} />
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

const WatchPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Loading video player...</p>
                </div>
            </div>
        }>
            <WatchContent />
        </Suspense>
    );
};

export default WatchPage;