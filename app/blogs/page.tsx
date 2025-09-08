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
import { PenSquare, BookOpen } from 'lucide-react';

// --- THIS IS THE FIX ---
// The Post interface now correctly defines isFeatured as a required boolean.
interface Post {
    id: string;
    slug: string;
    title: string;
    authorName: string;
    createdAt: string;
    excerpt: string;
    imageUrl: string;
    isFeatured: boolean; // Changed from optional (isFeatured?:) to required
}
// --------------------

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
                            excerpt: data.content.substring(0, 200).replace(/<[^>]+>/g, '') + '...',
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
        return <div className="bg-black h-screen flex items-center justify-center text-white">Loading Airena Blog...</div>;
    }

    const topStory = posts.find(p => p.isFeatured) || (posts.length > 0 ? posts[0] : null);
    const otherStories = posts.filter(p => p.id !== topStory?.id);

    return (
        <div className="bg-transparent">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-gray-800 pb-8">
                         <div className="flex items-center gap-4">
                            <BookOpen className="text-emerald-500 hidden md:block" size={40}/>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">The Airena Blog</h1> {/* Smaller, tighter tracking */}
                                <p className="text-gray-400 mt-3 text-lg">News, updates, and stories from the community.</p> {/* Slightly larger subtext for balance */}
                            </div>
                         </div>
                        {isAdmin && (
                            <Link href="/blogs/new" className="mt-6 md:mt-0 w-full md:w-auto bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105 whitespace-nowrap flex items-center justify-center gap-2">
                                <PenSquare size={18}/> Create Post
                            </Link>
                        )}
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-24 bg-white/5 backdrop-blur-md border border-gray-800 rounded-2xl">
                            <h2 className="text-3xl font-bold text-gray-400">No Posts Yet</h2>
                            <p className="text-gray-500 mt-4">Be the first to share a story with the community!</p>
                            {isAdmin && ( <Link href="/blogs/new" className="mt-8 inline-block bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">Write the First Post</Link> )}
                        </div>
                    ) : (
                        <>
                            {topStory && (
                                <div className="mb-20">
                                    <h2 className="text-3xl font-bold text-gray-300 mb-6 tracking-wide">Featured Story</h2>
                                    <Link href={`/blogs/${topStory.slug}`} className="block group">
                                         <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-gray-800">
                                            <div className="w-full h-[500px] relative">
                                               <AppImage src={topStory.imageUrl} alt={topStory.title} className="object-cover opacity-30 group-hover:opacity-20 group-hover:scale-105 transition-all duration-500" fallbackText="Top Story" />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                                <h3 className="text-3xl md:text-5xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">{topStory.title}</h3>
                                                <p className="text-gray-300 mb-6 max-w-3xl line-clamp-2">{topStory.excerpt}</p>
                                                <p className="text-md text-gray-400">{topStory.authorName} • {topStory.createdAt}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            <h2 className="text-3xl font-bold text-gray-300 mb-6 tracking-wide">Latest Posts</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {otherStories.map((post, index) => (
                                   <BlogCard key={post.id} post={post} isLarge={!topStory && index < 2} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPage;