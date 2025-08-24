// app/layout.tsx
"use client";

import React, { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ Import AuthProvider
import { AuthProvider } from "./context/AuthContext";

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
          .mouse-gradient-background::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(
              400px at var(--mouse-x) var(--mouse-y),
              rgba(29, 78, 216, 0.15),
              transparent 80%
            );
            z-index: -10;
            pointer-events: none;
          }
        `}</style>

        {/* ✅ Wrap everything inside AuthProvider */}
        <AuthProvider>
          <div className="bg-black text-white font-sans relative isolate overflow-x-hidden mouse-gradient-background">
            {/* Background Gradient Glow 1 */}
            <div
              className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
              aria-hidden="true"
            >
              <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#059669] to-[#34d399] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
            </div>

            {children}

            {/* Background Gradient Glow 2 */}
            <div
              className="absolute inset-x-0 top-[60%] -z-10 transform-gpu overflow-hidden blur-3xl"
              aria-hidden="true"
            >
              <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#059669] to-[#34d399] opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
