// app/components/AppImage.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface AppImageProps {
  src: string;
  alt: string;
  className?: string; // Make className optional for cleaner use with fill
  fallbackText: string;
}

const AppImage: React.FC<AppImageProps> = ({
  src,
  alt,
  className,
  fallbackText,
}) => {
  const [hasError, setHasError] = useState(false);

  // This is important: If the src prop changes (e.g., in a carousel),
  // we need to reset the error state to try loading the new image.
  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) {
    // If an error occurred, render a simple, reliable <img> tag for the fallback.
    // This prevents any further errors from the Next.js Image component.
    return (
      <div className={`relative ${className || 'w-full h-full'}`}>
        <img
          src={`https://placehold.co/600x400/111111/FFFFFF?text=${encodeURIComponent(
            fallbackText
          )}`}
          alt={alt}
          className="w-full h-full object-cover"
        />
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
        // When the primary image fails to load, set the error state to true.
        onError={() => {
          setHasError(true);
        }}
      />
    </div>
  );
};

export default AppImage;