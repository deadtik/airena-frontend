// app/components/HomePage.tsx
"use client";
import React from 'react';
import Header from '@/app/components/Header';
import HeroSection from '@/app/components/HeroSection';
import CategoriesSection from '@/app/components/CategoriesSection';
import FeaturedVideoSection from '@/app/components/FeaturedVideoSection';
import BigTournamentSection from '@/app/components/BigTournamentSection';
import FoundersClubSection from '@/app/components/FoundersClubSection';
import LeaderboardSection from '@/app/components/LeaderboardSection';
import Footer from '@/app/components/Footer';

const HomePage = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
    <>
        <Header onNavigate={onNavigate} />
        <main>
            <HeroSection onNavigate={onNavigate} />
            <CategoriesSection />
            <FeaturedVideoSection />
            <BigTournamentSection />
            <FoundersClubSection />
            <LeaderboardSection />
        </main>
        <Footer />
    </>
);

export default HomePage;
