// app/admin/dashboard/page.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { ShieldCheck, UserCheck, Youtube, Twitter, Check, X } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

// Define the shape of an application object
interface CreatorApplication {
    id: string;
    userId: string;
    userName: string;
    reason: string;
    youtubeLink?: string;
    twitterLink?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Timestamp;
}

const AdminDashboardPage = () => {
    const { user, loading, isSuperAdmin } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<CreatorApplication[]>([]);
    const [isLoadingApps, setIsLoadingApps] = useState(true);
    const [error, setError] = useState('');
    const [submittingId, setSubmittingId] = useState<string | null>(null); // To show loading state on buttons

    // This function fetches the applications from our API
    const fetchApplications = useCallback(async () => {
        if (isSuperAdmin && user) {
            try {
                setIsLoadingApps(true);
                const idToken = await user.getIdToken();
                const response = await fetch('/api/creator-applications', {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (!response.ok) throw new Error('Failed to fetch applications.');
                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error(error);
                setError('Could not load applications.');
            } finally {
                setIsLoadingApps(false);
            }
        }
    }, [user, isSuperAdmin]);

    useEffect(() => {
        if (!loading && !isSuperAdmin) {
            router.push('/'); // Redirect non-superAdmins
        }
        fetchApplications();
    }, [user, loading, isSuperAdmin, router, fetchApplications]);

    // This function handles both approving and rejecting
    const handleApplicationUpdate = async (targetUserId: string, newStatus: 'approved' | 'rejected') => {
        if (!user) return;
        setSubmittingId(targetUserId);
        setError('');
        try {
            const idToken = await user.getIdToken();
            const response = await fetch(`/api/creator-applications/${targetUserId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error(`Failed to ${newStatus} application.`);
            
            // On success, remove the application from the list for instant UI feedback
            setApplications(prev => prev.filter(app => app.userId !== targetUserId));
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmittingId(null);
        }
    };

    if (loading || !isSuperAdmin) {
        return <div className="h-screen bg-black flex items-center justify-center text-white">Verifying SuperAdmin Access...</div>;
    }

    return (
        <div className="bg-transparent">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <ShieldCheck className="w-10 h-10 text-emerald-400" />
                        <div>
                            <h1 className="text-4xl font-bold">SuperAdmin Dashboard</h1>
                            <p className="text-gray-400">Manage creator applications and user roles.</p>
                        </div>
                    </div>
                    
                    <div className="bg-[#181818]/50 border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold mb-4">Pending Creator Applications</h2>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        {isLoadingApps ? (
                            <p className="text-gray-400">Loading applications...</p>
                        ) : applications.length === 0 ? (
                            <p className="text-gray-400">No pending applications found.</p>
                        ) : (
                            <div className="space-y-4">
                                {applications.map(app => (
                                    <div key={app.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                            <div>
                                                <p className="font-bold text-lg text-white">{app.userName}</p>
                                                <p className="text-sm text-gray-500">{new Date(app.submittedAt.seconds * 1000).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex gap-2 mt-4 sm:mt-0">
                                                <button 
                                                    onClick={() => handleApplicationUpdate(app.userId, 'approved')}
                                                    disabled={submittingId === app.userId}
                                                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    <Check size={16}/> Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleApplicationUpdate(app.userId, 'rejected')}
                                                    disabled={submittingId === app.userId}
                                                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    <X size={16}/> Reject
                                                </button>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-gray-300 border-t border-gray-700 pt-4">{app.reason}</p>
                                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                            {app.youtubeLink && <a href={app.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-red-400 hover:underline"><Youtube size={16}/> YouTube</a>}
                                            {app.twitterLink && <a href={app.twitterLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sky-400 hover:underline"><Twitter size={16}/> Twitter/X</a>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboardPage;