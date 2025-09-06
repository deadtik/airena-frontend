// app/blog/page.tsx
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

interface Post {
    id: string;
    slug: string;
    title: string;
    authorName: string;
    createdAt: string;
    excerpt: string;
    imageUrl: string;
    isFeatured?: boolean;
}

const BlogPage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsCollection = collection(db, 'posts');
                const q = query(postsCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const postsData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const createdAtTimestamp = data.createdAt as Timestamp;
                    return {
                        id: doc.id,
                        slug: data.slug,
                        title: data.title,
                        authorName: data.authorName || 'Anonymous',
                        createdAt: createdAtTimestamp.toDate().toLocaleDateString('en-US', { /* date options */ }),
                        excerpt: data.content.substring(0, 200).replace(/<[^>]+>/g, '') + '...',
                        imageUrl: data.imageUrl,
                        isFeatured: data.isFeatured || false, // Get the featured flag
                    };
                });
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

    // --- NEW LOGIC TO FIND THE TOP STORY ---
    const topStory = posts.find(post => post.isFeatured);
    const otherStories = posts.filter(post => !post.isFeatured);
    // ------------------------------------

    return (
        <div className="bg-black text-white">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                 <div className="container mx-auto px-4">
                    {/* ... Header section of the blog page ... */}
                    
                    {posts.length === 0 ? (
                        <div className="text-center py-24 ...">
                            {/* ... No posts message ... */}
                        </div>
                    ) : (
                        <>
                            {topStory && (
                                <div className="mb-20">
                                    <h2 className="text-3xl font-bold ...">Featured Story</h2>
                                    <Link href={`/blog/${topStory.slug}`} className="block group">
                                        {/* ... Top Story JSX ... */}
                                    </Link>
                                </div>
                            )}

                            <h2 className="text-3xl font-bold ...">Latest Posts</h2>
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