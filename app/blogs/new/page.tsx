// app/blogs/new/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BlogEditor from '@/app/components/BlogEditor';
import { Star } from 'lucide-react';

const NewPostPage = () => {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isFeatured, setIsFeatured] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/blogs');
        }
    }, [isAdmin, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !title.trim() || !content.trim() || !image) {
            return setError("Please fill out all fields.");
        }
        
        setIsSubmitting(true);
        setError('');

        try {
            const idToken = await user.getIdToken();
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('image', image);
            formData.append('isFeatured', String(isFeatured));

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${idToken}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Post not Published.');
            }

            const { slug } = await response.json();
            router.push(`/blogs/${slug}`);
        } catch (err: unknown) { // Use unknown for better type safety
            setError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !isAdmin) {
        return <div className="bg-black h-screen flex items-center justify-center text-white">Verifying Admin Access...</div>;
    }

    return (
        <div className="bg-black text-white">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold">Create New Post</h1>
                        <p className="text-gray-400 mt-2">Share your story with the Airena community.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8 bg-[#181818]/50 border border-gray-800 p-8 rounded-2xl">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-lg font-semibold text-gray-300">Title</label>
                            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your catchy blog title..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="image" className="text-lg font-semibold text-gray-300">Featured Image</label>
                            <input id="image" type="file" accept="image/*" onChange={(e) => e.target.files && setImage(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30 transition-colors cursor-pointer" required />
                        </div>
                        <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center gap-3">
                                <Star className={`transition-colors ${isFeatured ? 'text-yellow-400' : 'text-gray-500'}`} />
                                <div>
                                    <label htmlFor="isFeatured" className="text-lg font-semibold text-gray-200">Top Story</label>
                                    <p className="text-sm text-gray-400">Mark this post as the featured story on the blog homepage.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFeatured(!isFeatured)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFeatured ? 'bg-emerald-500' : 'bg-gray-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-300">Content</label>
                            <BlogEditor value={content} onChange={setContent} />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-500/10 p-3 rounded-lg">{error}</p>}
                        <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105 disabled:opacity-50">
                            {isSubmitting ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default NewPostPage;