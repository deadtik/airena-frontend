// app/dashboard/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { db } from '@/app/firebase/config';
import { collection, query, where, getDocs, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { Upload, Eye, Users, Video as VideoIcon, Youtube, Twitter } from 'lucide-react';
import UserAvatar from '@/app/components/UserAvatar';

interface Video {
    id: string;
    title: string;
    createdAt: Timestamp;
    views: number;
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

    return (
        <div className="bg-transparent">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4">
                    {/* Dashboard Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b border-gray-800 pb-8">
                        <div className="flex items-center gap-4">
                            <UserAvatar src={channel?.photoURL} alt={channel?.channelName} size={64} />
                            <div>
                                <h1 className="text-3xl font-bold">{channel?.channelName || user?.displayName}</h1>
                                <p className="text-gray-400">Creator Dashboard</p>
                                <div className="flex items-center gap-4 mt-2">
                                    {channel?.youtubeLink && <a href={channel.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400"><Youtube size={20}/></a>}
                                    {channel?.twitterLink && <a href={channel.twitterLink} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300"><Twitter size={20}/></a>}
                                </div>
                            </div>
                        </div>
                        <Link href="/dashboard/upload" className="mt-4 sm:mt-0 w-full sm:w-auto bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2">
                            <Upload size={18} /> Upload Video
                        </Link>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10"><Eye className="w-6 h-6 text-emerald-400 mb-2" /><h3 className="text-3xl font-bold">{totalViews.toLocaleString()}</h3><p className="text-gray-400">Total Views</p></div>
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10"><Users className="w-6 h-6 text-emerald-400 mb-2" /><h3 className="text-3xl font-bold">{channel?.subscribers.toLocaleString() || 0}</h3><p className="text-gray-400">Subscribers</p></div>
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10"><VideoIcon className="w-6 h-6 text-emerald-400 mb-2" /><h3 className="text-3xl font-bold">{videos.length}</h3><p className="text-gray-400">Videos Uploaded</p></div>
                    </div>

                    {/* Videos List */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Your Content</h2>
                        <div className="space-y-4">
                            {videos.length === 0 ? <p className="text-gray-500">You haven't uploaded any videos yet.</p> : videos.map(video => (
                                <div key={video.id} className="flex items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                    <div className="w-32 h-20 bg-black rounded-md shrink-0">
                                        {/* In a real app, you'd generate a thumbnail */}
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <h4 className="font-bold text-white line-clamp-2">{video.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{video.createdAt.toDate().toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                         <p className="font-bold text-lg text-white">{video.views.toLocaleString()}</p>
                                         <p className="text-xs text-gray-500">Views</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreatorDashboardPage;