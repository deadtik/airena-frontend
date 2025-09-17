// app/components/UploadForm.tsx
"use client";
import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UploadCloud, Film, Gamepad2 } from 'lucide-react';

const UploadForm = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'games' | 'sports'>('games');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Placeholder for future progress bar

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return setError("You must be logged in to upload.");
        if (!title.trim() || !description.trim() || !videoFile) {
            return setError("Please fill out all fields and select a video file.");
        }

        setIsSubmitting(true);
        setError('');

        try {
            const idToken = await user.getIdToken();
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('video', videoFile);
            
            const response = await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${idToken}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Video upload failed.');
            }
            router.push('/watch'); // Redirect to the watch page on success
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#181818]/50 border border-gray-800 p-8 rounded-2xl">
            <div className="text-center mb-8">
                <UploadCloud className="mx-auto text-emerald-400 mb-4" size={40} />
                <h2 className="text-2xl font-bold">Upload New Video</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- THIS IS THE MISSING CODE --- */}
                <div className="space-y-2">
                    <label htmlFor="title" className="text-lg font-semibold text-gray-300">Video Title</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Epic Gameplay Highlights" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="description" className="text-lg font-semibold text-gray-300">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="A short summary of the video..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                </div>
                <div className="space-y-2">
                    <label className="text-lg font-semibold text-gray-300">Category</label>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setCategory('games')} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${category === 'games' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                            <Gamepad2 size={20} /> Games
                        </button>
                        <button type="button" onClick={() => setCategory('sports')} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${category === 'sports' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                            <Film size={20} /> Sports
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="video" className="text-lg font-semibold text-gray-300">Video File</label>
                    <input id="video" type="file" accept="video/mp4,video/quicktime,video/x-matroska" onChange={(e) => e.target.files && setVideoFile(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30" required />
                </div>
                {/* ---------------------------------- */}
                
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50">
                    {isSubmitting ? `Uploading... ${uploadProgress.toFixed(0)}%` : 'Upload Video'}
                </button>
            </form>
        </div>
    );
};

export default UploadForm;