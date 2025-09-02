// app/components/HeroSection.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import AppImage from "./AppImage";
import { useAuth } from "@/app/context/AuthContext";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

const HeroSection = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      image: "/airenaslide1.jpg",
      title: "The Ultimate Gaming & Sports Streaming Platform",
      subtitle:
        "Join the next generation of competitive gaming and sports streaming",
    },
    {
      image: "/airenaslide2.jpg",
      title: "Live Events, Every Day",
      subtitle:
        "Experience the thrill of live competition from around the globe",
    },
    {
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
      title: "Connect With Your Favorite Creators",
      subtitle: "Follow, subscribe, and support the streamers you love",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentSlide, slides.length]);

  return (
    <section className="relative h-screen bg-black">
      {/* Slides */}
      <div className="relative h-full w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <AppImage
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              fallbackText="Airena Event"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <div className="container mx-auto">
          <div className="max-w-4xl space-y-6">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
              {slides[currentSlide].title}
            </h2>
            <p className="text-gray-300 text-lg md:text-xl">
              {slides[currentSlide].subtitle}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4 pt-6">
              {user ? (
                <Link
                  href="/watch"
                  className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-600 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Start Watching
                </Link>
              ) : (
                <button
                  // TODO: Replace with appropriate modal open logic
                  onClick={() => alert("Please sign in to start watching.")}
                  className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-600 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Start Watching
                </button>
              )}

              <button className="flex items-center gap-2 text-gray-300 hover:text-white hover:underline underline-offset-4 transition-all">
                <Info size={20} /> What is Airena?
              </button>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-3 mt-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide
                    ? "w-8 bg-emerald-500"
                    : "w-4 bg-gray-500/70 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
