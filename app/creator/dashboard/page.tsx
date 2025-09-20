"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { db } from '@/app/firebase/config';
import { collection, query, where, getDocs, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { Upload, Eye, Users, Video as VideoIcon, Youtube, Twitter, Edit2, Trash2 } from 'lucide-react';
import UserAvatar from '@/app/components/UserAvatar';
import AppImage from '@/app/components/AppImage';

// Define the shape of your data objects
interface Video {
    id: string;
    title: string;
    createdAt: Timestamp;
    views: number;
    videoUrl: string;
}
interface Channel {
    channelName: string;
    photoURL: string | null;
    youtubeLink?: string;
    twitterLink?: string;
    subscribers: number;
}

const CreatorDashboardPage = () => {
    const { user, loading, isCreator } = useAuth();
    const router = useRouter();
    const [videos, setVideos] = useState<Video[]>([]);
    const [channel, setChannel] = useState<Channel | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    useEffect(() => {
        if (!loading && !isCreator) {
            router.push('/'); // Redirect non-creators
        }
        if (user && isCreator) {
            const fetchCreatorData = async () => {
                try {
                    // Fetch channel data
                    const channelRef = doc(db, 'channels', user.uid);
                    const channelSnap = await getDoc(channelRef);
                    if (channelSnap.exists()) {
                        setChannel(channelSnap.data() as Channel);
                    }

                    // Fetch videos
                    const videosRef = collection(db, 'videos');
                    const q = query(videosRef, where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));
                    const querySnapshot = await getDocs(q);
                    const videosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
                    setVideos(videosData);
                } catch (error) {
                    console.error("Failed to fetch creator data:", error);
                } finally {
                    setIsLoadingContent(false);
                }
            };
            fetchCreatorData();
        }
    }, [user, loading, isCreator, router]);

    if (loading || isLoadingContent || !isCreator) {
        return <div className="h-screen bg-black flex items-center justify-center text-white">Verifying Creator Access...</div>;
    }
    
    const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);

    const getYoutubeThumbnail = (videoUrl: string) => {
        try {
            const url = new URL(videoUrl);
            if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
                const videoId = url.searchParams.get('v') || url.pathname.split('/').pop();
                return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            }
        } catch (e) {
            // Not a valid URL or not a YouTube URL
        }
        return ''; // Return empty string for non-YouTube videos
    };

    return (
        <div className="bg-transparent">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4">
                    
                    {/* Dashboard Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
                        <div className="flex items-center gap-6">
                            {/* --- THIS IS THE FIX --- */}
                            <UserAvatar src={channel?.photoURL || user?.photoURL} alt={channel?.channelName || user?.displayName} size={80} />
                            <div>
                                <h1 className="text-4xl font-bold">{channel?.channelName || user?.displayName}</h1>
                                <p className="text-gray-400 text-lg">Creator Dashboard</p>
                                <div className="flex items-center gap-4 mt-2">
                                    {channel?.youtubeLink && <a href={channel.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 transition-colors"><Youtube size={20}/></a>}
                                    {channel?.twitterLink && <a href={channel.twitterLink} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors"><Twitter size={20}/></a>}
                                </div>
                            </div>
                        </div>
                        <Link href="/creator/dashboard/upload" className="mt-6 sm:mt-0 w-full sm:w-auto bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2 transform hover:scale-105 transition-transform">
                            <Upload size={18} /> Upload Video
                        </Link>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10"><Eye className="w-7 h-7 text-emerald-400 mb-3" /><h3 className="text-4xl font-bold">{totalViews.toLocaleString()}</h3><p className="text-gray-400 mt-1">Total Views</p></div>
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10"><Users className="w-7 h-7 text-emerald-400 mb-3" /><h3 className="text-4xl font-bold">{channel?.subscribers.toLocaleString() || 0}</h3><p className="text-gray-400 mt-1">Subscribers</p></div>
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10"><VideoIcon className="w-7 h-7 text-emerald-400 mb-3" /><h3 className="text-4xl font-bold">{videos.length}</h3><p className="text-gray-400 mt-1">Videos Uploaded</p></div>
                    </div>

                    {/* Videos List Table */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                        <div className="p-6 border-b border-white/10">
                           <h2 className="text-2xl font-bold">Your Content</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-sm text-gray-400">
                                    <tr>
                                        <th className="p-4 font-medium">Video</th>
                                        <th className="p-4 font-medium hidden md:table-cell">Date Uploaded</th>
                                        <th className="p-4 font-medium hidden sm:table-cell">Views</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videos.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-12 text-gray-500">You haven&apos;t uploaded any videos yet.</td>
                                        </tr>
                                    ) : (
                                        videos.map(video => (
                                        <tr key={video.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-24 h-14 bg-black rounded-md shrink-0 relative">
                                                        <AppImage src={getYoutubeThumbnail(video.videoUrl)} alt={video.title} fallbackText="Video" />
                                                    </div>
                                                    <p className="font-semibold text-white line-clamp-2">{video.title}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400 hidden md:table-cell">{video.createdAt.toDate().toLocaleDateString()}</td>
                                            <td className="p-4 text-gray-400 hidden sm:table-cell">{video.views.toLocaleString()}</td>
                                            <td className="p-4">
                                                <div className="flex gap-2 justify-end">
                                                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"><Edit2 size={16}/></button>
                                                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-md transition-colors"><Trash2 size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                   )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreatorDashboardPage;

