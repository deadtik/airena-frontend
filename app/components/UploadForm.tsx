// app/components/UploadForm.tsx
"use client";
import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UploadCloud, Film, Gamepad2 } from 'lucide-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const UploadForm = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'games' | 'sports'>('games');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return setError("You must be logged in to upload.");
        if (!title.trim() || !description.trim() || !videoFile) {
            return setError("Please fill out all fields and select a video file.");
        }

        setIsSubmitting(true);
        setError('');

        try {
            // 1. Upload the file directly to Firebase Storage from the client
            const storage = getStorage();
            const storageRef = ref(storage, `videos/${user.uid}/${Date.now()}_${videoFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, videoFile);

            // 2. Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                }, 
                (uploadError) => {
                    console.error("Upload failed:", uploadError);
                    setError("Upload failed. Please check the file and try again.");
                    setIsSubmitting(false);
                }, 
                async () => {
                    // 3. Upload completed successfully, now get the download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    
                    // 4. Send the metadata (NOT the file) to our server to create the Firestore entry
                    const idToken = await user.getIdToken();
                    const response = await fetch('/api/videos', {
                        method: 'POST',
                        headers: { 
                            'Authorization': `Bearer ${idToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title,
                            description,
                            category,
                            videoUrl: downloadURL, // Send the URL, not the file
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to save video details.');
                    }
                    
                    // 5. On success, redirect to the watch page
                    router.push('/watch');
                }
            );
        } catch (err) {
            setError((err as Error).message);
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
                {/* Form fields remain the same */}
                <div className="space-y-2">
                    <label htmlFor="title" className="text-lg font-semibold text-gray-300">Video Title</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Epic Gameplay Highlights" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3" required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="description" className="text-lg font-semibold text-gray-300">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="A short summary of the video..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3" required />
                </div>
                <div className="space-y-2">
                    <label className="text-lg font-semibold text-gray-300">Category</label>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setCategory('games')} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 ${category === 'games' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-gray-800 border-gray-700'}`}><Gamepad2 size={20} /> Games</button>
                        <button type="button" onClick={() => setCategory('sports')} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 ${category === 'sports' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-gray-800 border-gray-700'}`}><Film size={20} /> Sports</button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="video" className="text-lg font-semibold text-gray-300">Video File</label>
                    <input id="video" type="file" accept="video/mp4,video/quicktime,video/x-matroska" onChange={(e) => e.target.files && setVideoFile(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-emerald-500/20 file:text-emerald-300" required />
                </div>
                
                {/* Real-time Progress Bar */}
                {isSubmitting && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}

                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50">
                    {isSubmitting ? `Uploading... ${uploadProgress.toFixed(0)}%` : 'Upload Video'}
                </button>
            </form>
        </div>
    );
};

export default UploadForm;