// app/components/AdBanner.tsx
"use client";

import React, { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  adSlot: string;
  adFormat?: string;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  adFormat = "auto",
  className = "",
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
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
      {/* Load Google AdSense script only once */}
      <Script
        id="adsense-script"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
      />

      {/* Ad placeholder */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format={adFormat}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
      />

      {/* Push ads after render */}
      <Script id={`adsense-init-${adSlot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
};

export default AdBanner;