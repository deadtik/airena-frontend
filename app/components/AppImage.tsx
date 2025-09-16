// app/components/AppImage.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface AppImageProps {
  src: string;
  alt: string;
  className?: string; // This will now apply directly to the Next.js Image component
  fallbackText: string;
}

const AppImage: React.FC<AppImageProps> = ({
  src,
  alt,
  className,
  fallbackText,
}) => {
  const [hasError, setHasError] = useState(false);

  // When the src prop changes, reset the error state to try loading the new image
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const fallbackSrc = `https://placehold.co/600x400/111111/FFFFFF?text=${encodeURIComponent(
    fallbackText
  )}`;

  if (hasError) {
    // If an error occurred, render a simple <img> tag with the fallback.
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  // The component that uses AppImage MUST provide a container with position: relative
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={`object-cover ${className}`}
      onError={() => setHasError(true)}
    />
  );
};

export default AppImage;