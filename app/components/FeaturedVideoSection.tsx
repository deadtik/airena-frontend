// app/components/FeaturedVideoSection.tsx
"use client";
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const FeaturedVideoSection = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <section className="py-16 sm:py-24 px-4 sm:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="relative aspect-video rounded-2xl overflow-hidden group shadow-2xl shadow-emerald-500/10">
                   {isClient && (
                        <ReactPlayer
                            src="/featvid.mp4"
                            className="react-player"
                            playing
                            loop
                            muted
                            controls={true}
                            width="100%"
                            height="100%"
                        />
                   )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedVideoSection;
