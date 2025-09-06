// app/components/AppImage.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface AppImageProps {
  src: string;
  alt: string;
  className?: string; // className is optional, used for positioning/sizing container
  fallbackText: string;
}

const AppImage: React.FC<AppImageProps> = ({ src, alt, className, fallbackText }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const fallbackSrc = `https://placehold.co/600x400/111111/FFFFFF?text=${encodeURIComponent(fallbackText)}`;

  if (hasError) {
    return (
      <div className={`relative ${className || 'w-full h-full'}`}>
        <img src={fallbackSrc} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative ${className || 'w-full h-full'}`}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        onError={() => setHasError(true)}
      />
    </div>
  );
};
export default AppImage;