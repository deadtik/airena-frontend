// app/blogs/[slug]/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { db } from '@/app/firebase/config';
// --- THIS IS THE FIX ---
// Add 'limit' to the imports from firebase/firestore
import { collection, query, where, getDocs, Timestamp, limit } from 'firebase/firestore';
// --------------------
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import AppImage from '@/app/components/AppImage';
// import CommentSection from '@/app/components/CommentSection';
// import ReactionBar from '@/app/components/ReactionBar';

interface Post {
    id: string;
    title: string;
    authorName: string;
    createdAt: Timestamp;
    imageUrl: string;
    content: string;
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [postExists, setPostExists] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchPost = async () => {
            try {
                const postsCollection = collection(db, 'posts');
                // The 'limit' function is now correctly imported and can be used here
                const q = query(postsCollection, where("slug", "==", slug), limit(1));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setPost({ id: doc.id, ...doc.data() } as Post);
                } else {
                    setPostExists(false);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                setPostExists(false);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) {
        return <div className="bg-black h-screen flex items-center justify-center text-white">Loading Post...</div>;
    }

    if (!postExists || !post) {
        return notFound();
    }

    return (
        <div className="bg-transparent">
            <Header />
            <main className="pt-24 pb-16 min-h-screen">
                <article className="container mx-auto px-4 max-w-4xl">
                    <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                        <AppImage
                            src={post.imageUrl}
                            alt={post.title}
                            fallbackText={post.title}
                        />
                    </div>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-white">
                            {post.title}
                        </h1>
                        <p className="text-md text-gray-400">
                            By {post.authorName} •{" "}
                            {post.createdAt.toDate().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                    
                    <div
                        className="prose prose-invert prose-lg max-w-none 
                                   prose-p:text-gray-300 prose-p:leading-relaxed
                                   prose-h2:text-emerald-400 prose-h2:font-semibold
                                   prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/10
                                   prose-li:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* <ReactionBar postId={post.id} />
                    <CommentSection postId={post.id} /> */}

                </article>
            </main>
            <Footer />
        </div>
    );
}