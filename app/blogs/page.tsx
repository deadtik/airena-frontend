// app/blogs/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, auth } from '@/app/firebase/config';
import { collection, onSnapshot, orderBy, query, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BlogCard from '@/app/components/BlogCard';
import AppImage from '@/app/components/AppImage';
import { useAuth } from '@/app/context/AuthContext';
import { PenSquare, Sparkles, AlertTriangle, Edit, Trash2 } from 'lucide-react';

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
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // State for delete modal

    useEffect(() => {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('createdAt', 'desc'));

        // Use onSnapshot for real-time updates. Posts will appear, edit, and delete instantly.
        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const postsData = querySnapshot.docs
                    .map(doc => {
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
                    })
                    .filter((post): post is Post => post !== null);

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

        // Cleanup the listener when the component unmounts
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

            if (!response.ok) {
                throw new Error('Failed to delete post from server.');
            }
            // onSnapshot will handle the UI update automatically
            setDeleteConfirm(null);
        } catch (error) {
            console.error("Error deleting post:", error);
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
                    {/* Page Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 pb-6 border-b border-white/10">
                        <div className="mb-6 lg:mb-0">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                                    Stories & Ideas
                                </h1>
                            </div>
                            <p className="text-xl text-white/60 max-w-2xl">
                                Discover insights, experiences, and thoughts from our community
                            </p>
                        </div>

                        {isAdmin && (
                            <Link 
                                href="/blogs/new" 
                                className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40"
                            >
                                <PenSquare className="w-5 h-5" />
                                Write New Story
                            </Link>
                        )}
                    </div>

                    {/* Content */}
                    {posts.length === 0 ? (
                         <div className="text-center py-20">
                            <div className="max-w-md mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <PenSquare className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-3">No stories yet</h2>
                                <p className="text-white/60 mb-6 leading-relaxed">
                                    Be the first to share something amazing with the community.
                                </p>
                                {isAdmin && (
                                    <Link 
                                        href="/blogs/new" 
                                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                                    >
                                        <PenSquare className="w-4 h-4" />
                                        Write First Story
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {/* Featured Story */}
                            {topStory && (
                                <section>
                                    <div className="flex items-center justify-between mb-8">
                                       <h2 className="text-2xl font-semibold text-white">Featured Story</h2>
                                    </div>
                                    <div className="relative group">
                                        <BlogCard post={topStory} />
                                        {isAdmin && (
                                            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Link href={`/admin/edit-post/${topStory.id}`} className="p-2 bg-blue-500/80 hover:bg-blue-600 rounded-lg backdrop-blur-sm text-white">
                                                    <Edit size={16} />
                                                </Link>
                                                <button onClick={() => setDeleteConfirm(topStory.id)} className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg backdrop-blur-sm text-white">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Other Stories */}
                            {otherStories.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-semibold text-white mb-8">More Stories</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {otherStories.map((post) => (
                                            <div key={post.id} className="relative group">
                                                <BlogCard post={post} />
                                                {isAdmin && (
                                                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <Link href={`/admin/edit-post/${post.id}`} className="p-2 bg-blue-500/80 hover:bg-blue-600 rounded-lg backdrop-blur-sm text-white">
                                                            <Edit size={16} />
                                                        </Link>
                                                        <button onClick={() => setDeleteConfirm(post.id)} className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg backdrop-blur-sm text-white">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md mx-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Delete Post</h3>
                        <p className="text-white/70 mb-6">
                            Are you sure you want to delete this post? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeletePost(deleteConfirm)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BlogPage;