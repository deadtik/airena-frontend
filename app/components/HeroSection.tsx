// app/components/HeroSection.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import the Link component
import { Info } from 'lucide-react';
import AppImage from './AppImage';

interface Slide {
    image: string;
    title: string;
    subtitle: string;
}

// The 'onNavigate' prop has been removed
const HeroSection = () => {
    const slides: Slide[] = [
        {
            image: '/airenaslide1.jpg',
            title: 'The Ultimate Gaming & Sports Streaming Platform',
            subtitle: 'Join the next generation of competitive gaming and sports streaming'
        },
        {
            image: '/airenaslide2.jpg',
            title: 'Live Events, Every Day',
            subtitle: 'Experience the thrill of live competition from around the globe'
        },
        {
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
            title: 'Connect With Your Favorite Creators',
            subtitle: 'Follow, subscribe, and support the streamers you love'
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearTimeout(timer);
    }, [currentSlide, slides.length]);

    return (
        <section className="relative h-screen bg-black">
            <div className="relative h-full w-full overflow-hidden">
                {slides.map((slide, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        <AppImage src={slide.image} alt={slide.title} className="w-full h-full object-cover" fallbackText="Airena Event" />
                          <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white z-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <div className="container mx-auto">
                      <div className="max-w-3xl space-y-4">
                          <h2 className="text-4xl md:text-6xl font-bold leading-tight">{slides[currentSlide].title}</h2>
                          <p className="text-gray-300 text-lg">{slides[currentSlide].subtitle}</p>
                          <div className="flex items-center gap-4 pt-4">
                              {/* The button is now a Link component pointing to the /watch route */}
                              <Link href="/watch" className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105">
                                  Start Watching
                              </Link>
                              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"><Info size={20} /> What is Airena?</button>
                          </div>
                      </div>
                      <div className="flex justify-center space-x-2 mt-8">
                          {slides.map((_, index) => (
                              <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide ? 'w-8 bg-emerald-500' : 'w-4 bg-gray-500'}`}></button>
                          ))}
                      </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;