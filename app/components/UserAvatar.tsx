// app/components/UserAvatar.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

interface UserAvatarProps {
    src?: string | null;
    alt?: string | null;
    size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, alt, size = 40 }) => {
    // If a source URL is provided (e.g., from Google Sign-In),
    // use the optimized Next.js Image component.
    if (src) {
        return (
            <div 
                className="relative rounded-full overflow-hidden border-2 border-gray-700" 
                style={{ width: size, height: size }}
            >
                <Image
                    src={src}
                    alt={alt || 'User avatar'}
                    fill
                    sizes={`${size}px`}
                    style={{ objectFit: 'cover' }}
                />
            </div>
        );
    }

    // Fallback icon if no image source is provided (e.g., for users who signed up with email/phone).
    // This provides a clean and consistent look for all users.
    return (
        <div 
            className="rounded-full bg-gray-800 flex items-center justify-center text-gray-500 border-2 border-gray-700"
            style={{ width: size, height: size }}
        >
            <User size={size * 0.6} />
        </div>
    );
};

export default UserAvatar;