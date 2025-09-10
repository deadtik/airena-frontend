// app/blogs/[slug]/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/app/firebase/config';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
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

// --- THIS IS THE FIX ---
// Define a specific interface for the page's props, which is the standard
// and correct way to type a dynamic page in the Next.js App Router.
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}
// --------------------

// Use the new interface for the component's props.
export default function BlogPostPage({ params }: BlogPostPageProps) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!params.slug) return;
            try {
                const postsCollection = collection(db, 'posts');
                const q = query(postsCollection, where("slug", "==", params.slug));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setPost({ id: doc.id, ...doc.data() } as Post);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [params.slug]);

    if (loading) {
        return <div className="bg-black h-screen flex items-center justify-center text-white">Loading Post...</div>;
    }

    if (!post) {
        return <div className="bg-black h-screen flex items-center justify-center text-white">Post not found.</div>;
    }

    return (
        <div className="bg-transparent">
            <Header />
            <main className="pt-24 pb-16 min-h-screen">
                <article className="container mx-auto px-4 max-w-4xl">
                    <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden">
                        <AppImage src={post.imageUrl} alt={post.title} className="object-cover" fallbackText={post.title} />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{post.authorName} • {post.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white">{post.title}</h1>
                    <div className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-h2:text-emerald-400" dangerouslySetInnerHTML={{ __html: post.content }} />
                    {/* <ReactionBar postId={post.id} />
                    <CommentSection postId={post.id} /> */}
                </article>
            </main>
            <Footer />
        </div>
    );
}
