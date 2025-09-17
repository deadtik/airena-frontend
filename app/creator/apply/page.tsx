// app/creator/apply/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { db } from '@/app/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Rocket, Youtube, Twitter } from 'lucide-react';

const ApplyCreatorPage = () => {
    const { user, loading, isCreator } = useAuth();
    const router = useRouter();
    
    const [youtubeLink, setYoutubeLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [reason, setReason] = useState('');

    const [status, setStatus] = useState<'idle' | 'pending' | 'submitted' | 'already_creator'>('idle');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
        if (isCreator) {
            setStatus('already_creator');
        } else {
            const checkStatus = async () => {
                if (user) {
                    const appRef = doc(db, "creator-applications", user.uid);
                    const appSnap = await getDoc(appRef);
                    if (appSnap.exists()) {
                        setStatus('submitted');
                    }
                }
            };
            checkStatus();
        }
    }, [user, loading, isCreator, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !reason.trim()) return;

        setIsSubmitting(true);
        try {
            const applicationRef = doc(db, "creator-applications", user.uid);
            await setDoc(applicationRef, {
                userId: user.uid,
                userName: user.displayName || user.email,
                reason: reason,
                youtubeLink: youtubeLink.trim(),
                twitterLink: twitterLink.trim(),
                status: 'pending',
                submittedAt: new Date(),
            });
            setStatus('submitted');
        } catch (error) {
            console.error("Application submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    const renderContent = () => {
        if (status === 'already_creator') {
            return (
                <div className="text-center bg-white/5 border border-emerald-500/50 p-8 rounded-2xl">
                    {/* --- THIS IS THE FIX --- */}
                    {/* The apostrophe in "You're" is now correctly escaped as "&apos;" */}
                    <h2 className="text-2xl font-bold text-emerald-400">You&apos;re Already a Creator!</h2>
                    {/* -------------------- */}
                    <p className="text-gray-400 mt-2">You can start uploading content from your dashboard.</p>
                    <Link href="/dashboard" className="mt-6 inline-block bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold">Go to Dashboard</Link>
                </div>
            );
        }
        if (status === 'submitted') {
            return (
                <div className="text-center bg-white/5 border border-gray-800 p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold text-emerald-400">Application Submitted!</h2>
                    <p className="text-gray-400 mt-2">Thank you for your interest. We will review your application and get back to you soon.</p>
                </div>
            );
        }
        return (
            <form onSubmit={handleSubmit} className="space-y-6 bg-[#181818]/50 border border-gray-800 p-8 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="youtube" className="flex items-center gap-2 text-lg font-semibold text-gray-300">
                            <Youtube className="text-red-500" /> YouTube Channel
                        </label>
                        <input id="youtube" type="url" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com/c/YourChannel" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="twitter" className="flex items-center gap-2 text-lg font-semibold text-gray-300">
                            <Twitter className="text-sky-400" /> Twitter / X Profile
                        </label>
                        <input id="twitter" type="url" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} placeholder="https://x.com/YourProfile" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3" />
                    </div>
                </div>
                <div>
                    <label htmlFor="reason" className="text-lg font-semibold text-gray-300">Why do you want to be a creator?</label>
                    <p className="text-sm text-gray-500 mb-2">Tell us about the content you plan to create (e.g., game tutorials, sports commentary).</p>
                    <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={5} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3" required />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        );
    };

    return (
        <div className="bg-transparent">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="text-center mb-12">
                        <Rocket className="mx-auto text-emerald-400 mb-4" size={48} />
                        <h1 className="text-4xl md:text-5xl font-bold">Become a Creator</h1>
                        <p className="text-gray-400 mt-2">Join our community and start sharing your content on Airena.</p>
                    </div>
                    {renderContent()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ApplyCreatorPage;