// app/blog/new/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext'; // Or useAuth if that's your hook name
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BlogEditor from '@/app/components/BlogEditor';
import { auth } from '@/app/firebase/config';

const NewPostPage = () => {
    const { user, loading } = useAuth(); // Or useAuth
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !title.trim() || !content.trim() || !image) {
            return setError("Please fill out all fields.");
        }
        
        setIsSubmitting(true);
        setError('');

        try {
            const idToken = await user.getIdToken(true);
            
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('image', image);

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                // This will now display the server error on the screen
                const errorData = await response.json();
                throw new Error(errorData.error || 'Post not Published. An unknown error occurred.');
            }

            const { slug } = await response.json();
            router.push(`/blog/${slug}`);

        } catch (err: any) {
            setError(err.message); // Set the specific error message to display
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !user) {
        return <div className="bg-black h-screen flex items-center justify-center text-white">Verifying access...</div>;
    }

    return (
        <div className="bg-black text-white">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold">Create a New Post</h1>
                        <p className="text-gray-400 mt-2">Share your story with the Airena community.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8 bg-[#181818]/50 border border-gray-800 p-8 rounded-2xl">
                        {/* Form fields remain the same */}
                         <div className="space-y-2">
                            <label htmlFor="title" className="text-lg font-semibold text-gray-300">Title</label>
                            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your catchy blog title..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="image" className="text-lg font-semibold text-gray-300">Featured Image</label>
                            <input id="image" type="file" accept="image/*" onChange={(e) => e.target.files && setImage(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30 transition-colors cursor-pointer" required />
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