// app/blogs/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/app/firebase/config';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BlogCard from '@/app/components/BlogCard';
import AppImage from '@/app/components/AppImage';
import { useAuth } from '@/app/context/AuthContext';
import { PenSquare, Sparkles } from 'lucide-react';

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
    const { isAdmin } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsCollection = collection(db, 'posts');
                const q = query(postsCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const postsData = querySnapshot.docs
                    .map(doc => {
                        const data = doc.data();
                        if (!data.slug || !data.title || !data.createdAt) return null;
                        const createdAtTimestamp = data.createdAt as Timestamp;
                        return {
                            id: doc.id,
                            slug: data.slug,
                            title: data.title,
                            authorName: data.authorName || 'Anonymous',
                            createdAt: createdAtTimestamp.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                            excerpt: data.content.substring(0, 150).replace(/<[^>]+>/g, '') + '...',
                            imageUrl: data.imageUrl,
                            isFeatured: data.isFeatured || false,
                        };
                    })
                    .filter((post): post is Post => post !== null);

                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

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

    const topStory = posts.find(p => p.isFeatured) || (posts.length > 0 ? posts[0] : null);
    const otherStories = posts.filter(p => p.id !== topStory?.id);

    return (
        <div className="bg-transparent min-h-screen">
            <Header />
            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Elegant Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 pb-6 border-b border-white/10">
                        <div className="mb-6 lg:mb-0">
                            <div className="flex items-center gap-3 mb-3">
                                <Sparkles className="w-6 h-6 text-emerald-400" />
                                <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider">Stories</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                                The Airena Blog
                            </h1>
                            <p className="text-white/60 text-base sm:text-lg max-w-lg leading-relaxed">
                                Discover insights, updates, and stories from our community
                            </p>
                        </div>
                        
                        {isAdmin && (
                            <Link 
                                href="/blogs/new" 
                                className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                            >
                                <PenSquare className="w-4 h-4 group-hover:rotate-3 transition-transform" />
                                Write Post
                            </Link>
                        )}
                    </div>

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
                                        Write First Post
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {/* Featured Story */}
                            {topStory && (
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                        <span className="text-white/70 font-medium text-sm uppercase tracking-wider">Featured</span>
                                    </div>
                                    
                                    <Link href={`/blogs/${topStory.slug}`} className="block group">
                                        <article className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-500 hover:border-emerald-500/30">
                                            <div className="aspect-[21/9] sm:aspect-[21/8] lg:aspect-[21/7] relative">
                                                <AppImage 
                                                    src={topStory.imageUrl} 
                                                    alt={topStory.title} 
                                                    className="opacity-40 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700" 
                                                    fallbackText="Featured Story" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                            </div>
                                            
                                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300 leading-tight">
                                                    {topStory.title}
                                                </h2>
                                                <p className="text-white/80 mb-4 text-sm sm:text-base max-w-2xl line-clamp-2 leading-relaxed">
                                                    {topStory.excerpt}
                                                </p>
                                                <div className="flex items-center text-white/60 text-sm">
                                                    <span className="font-medium">{topStory.authorName}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{topStory.createdAt}</span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </div>
                            )}

                            {/* Latest Posts */}
                            {otherStories.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-8">
                                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                                        <h2 className="text-white/70 font-medium text-sm uppercase tracking-wider">Latest Stories</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                        {otherStories.map((post, index) => (
                                            <BlogCard 
                                                key={post.id} 
                                                post={post} 
                                                isLarge={!topStory && index < 2} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPage;