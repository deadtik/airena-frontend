// app/components/AdBanner.tsx
"use client";
import React, { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle?: { push: (obj: object) => void; };
    }
}

interface AdBannerProps {
    adSlot: string;
    adFormat?: string;
    className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ adSlot, adFormat = "auto", className = "" }) => {
    useEffect(() => {
        try {
            if (window.adsbygoogle) {
                window.adsbygoogle.push({});
            }
        } catch (err) {
            console.error("AdSense push error:", err);
        }
    }, []);

    if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || !adSlot) {
        return null; // Don't render an ad if the IDs are missing
    }

    return (
        <div className={`ad-container ${className}`}>
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
                 data-ad-slot={adSlot}
                 data-ad-format={adFormat}
                 data-full-width-responsive="true"></ins>
        </div>
    );
};

export default AdBanner;