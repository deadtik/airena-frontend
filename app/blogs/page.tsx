"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/app/firebase/config';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BlogCard from '@/app/components/BlogCard';
import { useAuth } from '@/app/context/AuthContext';
import { PenSquare, Sparkles, AlertTriangle, BookOpen, Star, Clock, TrendingUp } from 'lucide-react';

interface Post {
    id: string;
    slug: string;
    title: string;
    authorName: string;
    createdAt: string;
    excerpt: string;
    imageUrl: string;
    isFeatured: boolean;
}

const BlogPage = () => {
    const { user, isAdmin } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const postsData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    if (!data.slug || !data.title || !data.createdAt || !data.content) return null;
                    const createdAtTimestamp = data.createdAt as Timestamp;
                    return {
                        id: doc.id,
                        slug: data.slug,
                        title: data.title,
                        authorName: data.authorName || 'Anonymous',
                        createdAt: createdAtTimestamp.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                        excerpt: data.content.substring(0, 150).replace(/<[^>]+>/g, '') + '...',
                        imageUrl: data.imageUrl || '',
                        isFeatured: data.isFeatured || false,
                    };
                }).filter((post): post is Post => post !== null);
                setPosts(postsData);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Error fetching posts:", err);
                setError("Failed to load stories. Please try again later.");
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleDeletePost = async (postId: string) => {
        if (!isAdmin || !user) return;
        try {
            const idToken = await user.getIdToken();
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${idToken}` }
            });
            if (!response.ok) throw new Error('Failed to delete post');
            setDeleteConfirm(null);
        } catch (error) {
            setError("Failed to delete post. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
                {/* Animated background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
                    <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
                </div>
                
                <Header />
                <div className="relative h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative mb-8">
                            <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin mx-auto" style={{animationDelay: '0.3s'}} />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                            Loading Stories
                        </h2>
                        <p className="text-gray-400">Discovering amazing content for you...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
    
    if (error) {
       return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
                {/* Animated background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
                </div>
                
                <Header />
                <div className="relative h-screen flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto">
                        <div className="relative group">
                            <div className="bg-white/5 backdrop-blur-md border border-red-500/30 rounded-3xl p-12 shadow-2xl">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                                    <AlertTriangle className="w-10 h-10 text-red-400" />
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent mb-4">
                                    Something went wrong
                                </h2>
                                <p className="text-gray-300 leading-relaxed">{error}</p>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500 -z-10" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const topStory = posts.find(p => p.isFeatured) || (posts.length > 0 ? posts[0] : null);
    const otherStories = posts.filter(p => p.id !== topStory?.id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
                <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
                <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '6s'}} />
            </div>
            
            <Header />
            
            <main className="relative pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center md:text-left mb-16 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-8 md:mb-0">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl border border-emerald-500/30">
                                    <BookOpen className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                                    <span className="text-sm font-medium text-emerald-400 uppercase tracking-wider">Stories & Insights</span>
                                </div>
                            </div>
                            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent mb-4">
                                Airena Blog
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                                Discover the latest news, updates, and inspiring stories from our vibrant gaming and sports community.
                            </p>
                            
                            {/* Stats */}
                            <div className="flex items-center gap-8 mt-6">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    <span className="text-sm">{posts.length} Stories</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                    <span className="text-sm">{posts.filter(p => p.isFeatured).length} Featured</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-5 h-5 text-cyan-400" />
                                    <span className="text-sm">Updated Daily</span>
                                </div>
                            </div>
                        </div>
                        
                        {isAdmin && (
                            <Link 
                                href="/blogs/new" 
                                className="group relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
                            >
                                <PenSquare size={20} className="group-hover:rotate-12 transition-transform duration-300" /> 
                                Write a Story
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
                            </Link>
                        )}
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="relative inline-block mb-8">
                                <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center border border-white/10">
                                    <BookOpen className="w-16 h-16 text-gray-500" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
                            </div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent mb-4">
                                No Stories Yet
                            </h2>
                            <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                                Be the first to share an amazing story with our community! Your voice matters.
                            </p>
                            {isAdmin && (
                                <Link 
                                    href="/blogs/new" 
                                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
                                >
                                    <PenSquare size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                                    Write the First Story
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-20">
                            {topStory && (
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                                                <Star className="w-6 h-6 text-yellow-400" />
                                            </div>
                                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                                Featured Story
                                            </h2>
                                        </div>
                                        <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/50 to-transparent" />
                                        <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                                            <span className="text-sm font-medium text-yellow-300">Must Read</span>
                                        </div>
                                    </div>
                                    
                                    <div className="relative group">
                                        <BlogCard post={topStory} onDelete={setDeleteConfirm} isLarge />
                                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                                    </div>
                                </section>
                            )}
                            
                            {otherStories.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/30">
                                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                                Latest Stories
                                            </h2>
                                        </div>
                                        <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />
                                        <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full">
                                            <span className="text-sm font-medium text-emerald-300">{otherStories.length} Stories</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {otherStories.map((post, index) => (
                                            <div key={post.id} className="relative group">
                                                <BlogCard post={post} onDelete={setDeleteConfirm} />
                                                <div 
                                                    className="absolute -inset-1 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                                                    style={{animationDelay: `${index * 0.1}s`}}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </main>
            
            {/* Enhanced Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="relative group">
                        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                                    <AlertTriangle className="w-8 h-8 text-red-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Delete Story</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Are you sure you want to delete this story? This action cannot be undone and will permanently remove the content.
                                </p>
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setDeleteConfirm(null)} 
                                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl font-medium transition-all duration-300 border border-white/20 hover:border-white/30"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleDeletePost(deleteConfirm)} 
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                                >
                                    Delete Forever
                                </button>
                            </div>
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500 -z-10" />
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    );
};

export default BlogPage;