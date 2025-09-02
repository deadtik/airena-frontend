// app/components/AppImage.tsx
"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface AppImageProps {
    src: string;
    alt: string;
    className: string;
    fallbackText: string;
}

const AppImage: React.FC<AppImageProps> = ({ src, alt, className, fallbackText }) => {
    const [currentSrc, setCurrentSrc] = useState(src);

    const isLocal = currentSrc.startsWith('/');

    if (isLocal) {
        return (
            <div className={`relative ${className}`}>
                <Image
                    src={currentSrc}
                    alt={alt}
                    fill
                    style={{ objectFit: 'contain' }}
                    onError={() => {
                        setCurrentSrc(`https://placehold.co/600x400/111111/FFFFFF?text=${encodeURIComponent(fallbackText)}`);
                    }}
                />
            </div>
        );
    }

    return (
        <img
            src={currentSrc}
            alt={alt}
            className={className}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/600x400/111111/FFFFFF?text=${encodeURIComponent(fallbackText)}`;
            }}
        />
    );
};

export default AppImage;