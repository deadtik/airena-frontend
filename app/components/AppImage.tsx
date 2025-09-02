// app/components/AppImage.tsx
"use client";
import React from 'react';
import Image from 'next/image';

interface AppImageProps {
    src: string;
    alt: string;
    className: string;
    fallbackText: string;
}

const AppImage: React.FC<AppImageProps> = ({ src, alt, className, fallbackText }) => {
    const isLocal = src.startsWith('/');

    // Use Next.js Image for local assets for optimization
    if (isLocal) {
        return (
            <div className={`relative ${className}`}>
                 <Image
                    src={src}
                    alt={alt}
                    fill
                    style={{ objectFit: 'contain' }} // or 'cover' depending on need
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://placehold.co/600x400/111111/FFFFFF?text=${encodeURIComponent(fallbackText)}`;
                    }}
                />
            </div>
        );
    }
    
    // Use standard <img> for external URLs
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/600x400/111111/FFFFFF?text=${encodeURIComponent(fallbackText)}`;
            }}
        />
    );
};

export default AppImage;