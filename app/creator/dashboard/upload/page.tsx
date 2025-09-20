// app/dashboard/upload/page.tsx
"use client";
import React from 'react';
import UploadForm from '@/app/components/UploadForm'; 
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const UploadPage = () => {
    return (
        <div className="bg-transparent">
            <Header />
            <main className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-4 max-w-2xl">
                    <UploadForm />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UploadPage;