// app/admin/edit-post/[postId]/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import BlogEditor from '@/app/components/BlogEditor';
import { Star } from 'lucide-react';
import AppImage from '@/app/components/AppImage';

const EditPostPage = () => {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const params = useParams();
    const postId = params.postId as string;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingPost, setIsLoadingPost] = useState(true);

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/blogs');
        }
        if (postId && user) {
            const fetchPost = async () => {
                try {
                    const res = await fetch(`/api/posts/${postId}`);
                    if (!res.ok) throw new Error("Post not found.");
                    const data = await res.json();
                    setTitle(data.title);
                    setContent(data.content);
                    setIsFeatured(data.isFeatured || false);
                    setExistingImageUrl(data.imageUrl);
                } catch (err) {
                    setError("Failed to load post data.");
                } finally {
                    setIsLoadingPost(false);
                }
            };
            fetchPost();
        }
    }, [isAdmin, loading, postId, router, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return setError("Authentication error.");
        
        setIsSubmitting(true);
        setError('');

        try {
            const idToken = await user.getIdToken();
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('isFeatured', String(isFeatured));
            if (image) {
                formData.append('image', image);
            }

            const response = await fetch(`/api/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${idToken}` },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to update post.');
            
            router.push('/blogs');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || isLoadingPost || !isAdmin) {
        return <div className="bg-black h-screen flex items-center justify-center text-white">Verifying Access & Loading Editor...</div>;
    }

    return (
        <div className="bg-transparent">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-lg">
                        <div>
                            <label htmlFor="title" className="block mb-2 font-medium">Title</label>
                            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-800 rounded p-3" />
                        </div>
                        <div>
                            <label htmlFor="image" className="block mb-2 font-medium">Change Featured Image (Optional)</label>
                            <input id="image" type="file" accept="image/*" onChange={(e) => e.target.files && setImage(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-emerald-500/20 file:text-emerald-300" />
                            {existingImageUrl && !image && (
                                <div className="mt-4 relative w-40 h-24 rounded-lg overflow-hidden">
                                    <AppImage src={existingImageUrl} alt="Current featured image" fallbackText="Current Image"/>
                                </div>
                            )}
                        </div>
                         <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                             <div className="flex items-center gap-3">
                                <Star className={`transition-colors ${isFeatured ? 'text-yellow-400' : 'text-gray-500'}`} />
                                <div>
                                    <label htmlFor="isFeatured" className="text-lg font-semibold text-gray-200">Top Story</label>
                                    <p className="text-sm text-gray-400">Mark this post as the featured story.</p>
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
                        <div>
                            <label className="block mb-2 font-medium">Content</label>
                            <BlogEditor value={content} onChange={setContent} />
                        </div>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 p-3 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50">
                            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default EditPostPage;