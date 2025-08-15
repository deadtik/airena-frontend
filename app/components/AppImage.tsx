// app/components/AppImage.tsx
"use client";
import React from 'react';

// Generic Image component with error handling
const AppImage: React.FC<{ src: string; alt: string; className: string; fallbackText: string; }> = ({ src, alt, className, fallbackText }) => (
    <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/1920x1080/111111/FFFFFF?text=${encodeURIComponent(fallbackText)}`;
        }}
    />
);

export default AppImage;
