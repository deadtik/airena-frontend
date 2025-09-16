"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/app/firebase/config';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BlogCard from '@/app/components/BlogCard';
import { useAuth } from '@/app/context/AuthContext';
import { PenSquare, Sparkles, AlertTriangle, BookOpen } from 'lucide-react';

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
            <div className="bg-transparent min-h-screen">
                <Header />
                <div className="h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-400 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-white/80 text-lg">Loading stories...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
    
    if (error) {
       return (
            <div className="bg-transparent min-h-screen">
                <Header />
                <div className="h-screen flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto bg-white/5 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
                         <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-3">Something went wrong</h2>
                        <p className="text-white/60 leading-relaxed">{error}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const topStory = posts.find(p => p.isFeatured) || (posts.length > 0 ? posts[0] : null);
    const otherStories = posts.filter(p => p.id !== topStory?.id);

    return (
        <div className="bg-transparent min-h-screen">
            <Header />
            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center md:text-left mb-16 border-b border-gray-800 pb-12 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">The Airena Blog</h1>
                            <p className="text-gray-400 mt-3 text-lg">News, updates, and stories from the community.</p>
                        </div>
                        {isAdmin && (
                            <Link href="/blogs/new" className="group shrink-0 bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                                <PenSquare size={18} /> Write a Post
                            </Link>
                        )}
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-24 bg-white/5 backdrop-blur-md border border-gray-800 rounded-2xl">
                            <h2 className="text-3xl font-bold text-gray-400">No Posts Yet</h2>
                            <p className="text-gray-500 mt-4">Be the first to share a story with the community!</p>
                            {isAdmin && (<Link href="/blogs/new" className="mt-8 inline-block bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">Write the First Post</Link>)}
                        </div>
                    ) : (
                        <div className="space-y-20">
                            {topStory && (
                                <section>
                                    <h2 className="text-3xl font-bold text-gray-300 mb-6 tracking-wide">Featured Story</h2>
                                    <BlogCard post={topStory} onDelete={setDeleteConfirm} isLarge />
                                </section>
                            )}
                            {otherStories.length > 0 && (
                                <section>
                                    <h2 className="text-3xl font-bold text-gray-300 mb-6 tracking-wide">Latest Posts</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {otherStories.map((post) => (
                                            <BlogCard key={post.id} post={post} onDelete={setDeleteConfirm} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </main>
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md mx-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Delete Post</h3>
                        <p className="text-white/70 mb-6">Are you sure? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-neutral-400 hover:text-white cursor-pointer">Cancel</button>
                            <button onClick={() => handleDeletePost(deleteConfirm)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};
export default BlogPage;