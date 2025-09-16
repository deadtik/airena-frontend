// app/layout.tsx
"use client";

import React, { useEffect } from "react";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Script from 'next/script'; // Import the Next.js Script component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} font-sans antialiased`}
      >
        {/* --- THIS IS THE FIX --- */}
        {/* Add the AdSense script here, using the environment variable */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive" // Loads the script after the page is usable
        />
        {/* -------------------- */}

        <style jsx global>{`
          /* ... your global styles ... */
        `}</style>

        <AuthProvider>
          <div className="bg-black text-white font-sans relative isolate overflow-x-hidden mouse-gradient-background">
            {/* ... your background gradients ... */}
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}