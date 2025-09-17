// app/dashboard/page.tsx
"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { UploadCloud, User, Video } from 'lucide-react';
import UploadForm from '@/app/components/UploadForm'; // We will create this next

const CreatorDashboardPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/'); // Redirect unauthenticated users
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="bg-black h-screen flex items-center justify-center text-white">Verifying Creator Access...</div>;
    }

    return (
        <div className="bg-transparent">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex items-center gap-4 mb-12 border-b border-gray-800 pb-8">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="User Avatar" className="w-16 h-16 rounded-full" />
                        ) : (
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                                <User size={32} className="text-gray-500" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold">{user.displayName || 'Creator'} Dashboard</h1>
                            <p className="text-gray-400">Manage your channel and upload new content.</p>
                        </div>
                    </div>
                    <UploadForm />

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreatorDashboardPage;