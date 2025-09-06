// app/layout.tsx
"use client";

import React, { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "./context/AuthContext";
// Unused 'auth' import has been removed.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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